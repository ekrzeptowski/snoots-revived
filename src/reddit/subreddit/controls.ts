import type { Client } from "../../client";
import type { Query } from "../../gateway/types";
import type { Data } from "../../helper/types";
import type { Comment } from "../comment/object";
import type { Listing } from "../listing/listing";
import type { Post } from "../post/object";
import type { PostSort } from "../post/types";
import type {
  RedditObject,
  SearchSort,
  SearchSyntax,
  TimeRange,
} from "../types";
import type { BannedUser } from "../user/moderator-actioned/banned";
import type { ModeratorActionedUser } from "../user/moderator-actioned/base";
import type { SubredditData } from "./object";
import type { FileDetails, SubredditFlair } from "./types";

import * as fs from "fs";
import { blob } from "node:stream/consumers";
import path from "path";
import stream from "stream";

import { makeDebug } from "../../helper/debug";
import { BaseControls } from "../base-controls";
import { CommentListing } from "../comment/listing/listing";
import { mediaTypes, mimeTypes, submissionIdRegex } from "../const";
import { fakeListingAfter } from "../listing/util";
import { MediaFile, MediaGif, MediaImg, MediaVideo } from "../mediafile/object";
import { PostListing } from "../post/listing";
import { PostOrCommentListing } from "../post-or-comment/listing";
import { BannedUserListing } from "../user/moderator-actioned/banned";
import { ModeratorActionedUserListing } from "../user/moderator-actioned/base";
import { Moderator } from "../user/moderator-actioned/moderator";
import { assertKind, fromRedditData, isBrowser, webSocket } from "../util";
import { SubredditListing } from "./listing";
import { Subreddit } from "./object";

const debug = makeDebug("controls:subreddit");
const debugPost = makeDebug("controls:subreddit:post");
const debugUpload = makeDebug("controls:subreddit:upload");

/** A single captcha identifier and response. */
export interface Captcha {
  /** The identifier of the captcha. */
  iden: string;
  /** The response to the captcha. */
  response: string;
}

/** Extra options regarding bans. */
export interface BanOptions {
  /** How long to ban the user for, in days. Omit this for a permanent ban. */
  duration?: number;

  /** The ban message. This will be sent to the user. */
  message?: string;

  /**
   * A note to the other moderators about why this user was banned (max 300
   * characters).
   */
  note?: string;

  /** The reason for the ban (max 100 characters). */
  reason?: string;
}

/** Extra options for submitting a post. */
export interface TextPostOptions {
  /**
   * Whether or not to send inbox replies for the new post (defaults to
   * `true`).
   *
   * If you want to change this later you can use
   * {@link Post.enableInboxReplies} and {@link Post.disableInboxReplies}.
   */
  sendReplies?: boolean;

  /**
   * The captcha information. This is only necessary if the authenticated
   * account requires a captcha to submit posts and comments.
   */
  captcha?: Captcha;

  /** Whether or not this post is NSFW (defaults to `false`). */
  nsfw?: boolean;

  /** Whether or not this post is a spoiler (defaults to `false`). */
  spoiler?: boolean;
}

/** Extra options for submitting a link post. */
export interface LinkPostOptions extends TextPostOptions {
  /**
   * Whether or not to error if this link has been submitted before (defaults
   * to `false`).
   */
  unique?: boolean;
}

/** Extra options for media uploads. */
export interface UploadMediaOptions {
  /**
   * The media file to upload. This should either be the path to the file (as a
   * `string`), or a
   * [stream.Readable](https://nodejs.org/api/stream.html#stream_class_stream_readable),
   * or a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob),
   * or a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) in environments where
   * the filesystem is unavailable (e.g. browsers).
   */
  file: string | stream.Readable | Blob | File;
  /**
   * The name that the file should have. Required when it cannot get directly
   * extracted from the provided file (e.g ReadableStream, Blob).
   */
  name?: string;
  /**
   * Determines the media file type. This should be one of `img, video, gif`.
   */
  type?: "img" | "video" | "gif";
  /**
   * A caption for the embedded file to be used on selfposts bodies and gallery items.
   * @desc **NOTE**: Captions on gallery items must be 180 characters or less.
   */
  caption?: string;
  /** An external URL to be used on gallery items. */
  outboundUrl?: string;
  /**
   * If `true`, the file won't get uploaded, and this method will return
   * `null`. Useful if you only want to validate the parameters before actually
   * uploading the file.
   */
  validateOnly?: boolean;
}

export interface UploadInlineMediaOptions extends UploadMediaOptions {
  type: "img" | "video" | "gif";
}

/** Media types. */
export interface MediaType {
  readonly img: MediaImg;
  readonly video: MediaVideo;
  readonly gif: MediaGif;
}

/** The response from uploading a media file. */
export interface UploadResponse {
  args: {
    /** @example '//reddit-uploaded-video.s3-accelerate.amazonaws.com' */
    action: string;
    /** Headers */
    fields: {
      name: string;
      value: string;
    }[];
  };
  asset: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    asset_id: string;
    payload: {
      filepath: string;
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    processing_state: string;
    /** @example 'wss://ws-0ffbcc476ebd6c972.wss.redditmedia.com/<asset_id>?m=<random-base64-string>' */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    websocket_url: string;
  };
}

type PostTypes = "self" | "link" | "crosspost" | "image";

interface PostOptions {
  kind: PostTypes;
  title: string;
  text?: string;
  url?: string;
  crosspostFullname?: string;
  sendReplies: boolean;
  captcha?: Captcha;
  nsfw: boolean;
  spoiler: boolean;
  // This only applies to link and cross posts
  resubmit: boolean;
  websocketUrl?: string;
}

/**
 * The url pattern that `/random` will redirect to. Used to both verify the
 * redirect and extract the post ID.
 */
const randomRedirectPattern =
  /https:\/\/www\.reddit\.com\/r\/.+?\/comments\/(.+?)\/.+?\//;

/**
 * Various methods to allow you to interact with subreddits.
 *
 * @category Controls
 */
export class SubredditControls extends BaseControls {
  /** @internal */
  constructor(client: Client) {
    super(client, "r/");
  }

  /**
   * Fetch a subreddit.
   *
   * @param subreddit The name of the subreddit to fetch.
   *
   * @returns A promise that resolves to the requested subreddit.
   */
  async fetch(subreddit: string): Promise<Subreddit> {
    const raw: RedditObject = await this.gateway.get(`r/${subreddit}/about`);
    return this.fromRaw(raw);
  }

  /**
   * Accept a moderator invite.
   *
   * @param subreddit The name of the subreddit to accept the invite for.
   *
   * @returns A promise that resolves when the invite has been accepted.
   */
  async acceptModeratorInvite(subreddit: string): Promise<void> {
    await this.gateway.post(`r/${subreddit}/api/accept_moderator_invite`, {});
  }

  /**
   * Add an approved poster.
   *
   * @param subreddit The name of the subreddit to add the contributor to.
   * @param username The username of the user to add.
   *
   * @returns A promise that resolves when the contributor has been added.
   */
  async addContributor(subreddit: string, username: string): Promise<void> {
    await this.friend(subreddit, username, "contributor");
  }

  /**
   * Remove an approved poster.
   *
   * @param subreddit The name of the subreddit to remove the contributor from.
   * @param username The username of the user to remove.
   *
   * @returns A promise that resolves when the contributor has been removed.
   */
  async removeContributor(subreddit: string, username: string): Promise<void> {
    await this.unfriend(subreddit, username, "contributor");
  }

  /** @internal */
  async leaveContributor(subredditId: string): Promise<void> {
    await this.gateway.post("api/leavecontributor", { id: subredditId });
  }

  /**
   * Get the list of approved contributors for a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 contributors.
   *
   * @param subreddit The name of the subreddit to get contributors for.
   *
   * @returns A listing of approved contributors.
   */
  getContributors(subreddit: string): Listing<ModeratorActionedUser> {
    return new ModeratorActionedUserListing(fakeListingAfter(""), {
      request: { url: `r/${subreddit}/about/contributors`, query: {} },
      client: this.client,
    });
  }

  /**
   * Add a user to the list of approved wiki editors.
   *
   * @param subreddit The name of the subreddit to add the user to.
   * @param username The username of the user to add.
   *
   * @returns A promise that resolves when the wiki editor has been added.
   */
  async addWikiContributor(subreddit: string, username: string): Promise<void> {
    await this.friend(subreddit, username, "wikicontributor");
  }

  /**
   * Remove a user from the list of approved wiki editors.
   *
   * @param subreddit The name of the subreddit to remove the user from.
   * @param username The username of the user to remove.
   *
   * @returns A promise that resolves when the wiki editor has been removed.
   */
  async removeWikiContributor(
    subreddit: string,
    username: string
  ): Promise<void> {
    await this.unfriend(subreddit, username, "wikicontributor");
  }

  /**
   * Get the list of approved wiki contributors for a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 wiki contributors.
   *
   * @param subreddit The name of the subreddit to get wiki contributors for.
   *
   * @returns A listing of approved wiki contributors.
   */
  getWikiContributors(subreddit: string): Listing<ModeratorActionedUser> {
    return new ModeratorActionedUserListing(fakeListingAfter(""), {
      request: { url: `r/${subreddit}/about/wikicontributors`, query: {} },
      client: this.client,
    });
  }

  /**
   * Ban a user from a subreddit.
   *
   * @param subreddit The name of the subreddit to ban the user from.
   * @param username The username of the user to ban.
   * @param options Any additional options for the ban.
   *
   * @returns A promise that resolves when the user has been banned.
   */
  async banUser(
    subreddit: string,
    username: string,
    options: BanOptions = {}
  ): Promise<void> {
    const friendOptions: Query = {};
    if (options.duration != undefined)
      friendOptions.duration = `${options.duration}`;
    if (options.message != undefined)
      friendOptions.ban_message = options.message;
    if (options.note != undefined) friendOptions.note = options.note;
    if (options.reason != undefined) friendOptions.ban_reason = options.reason;

    await this.friend(subreddit, username, "banned", friendOptions);
  }

  /**
   * Unban a user from a subreddit.
   *
   * @param subreddit The name of the subreddit to unban the user from.
   * @param username The username of the user to unban.
   *
   * @returns A promise that resolves when the user has been unbanned.
   */
  async unbanUser(subreddit: string, username: string): Promise<void> {
    await this.unfriend(subreddit, username, "banned");
  }

  /**
   * Get the list of banned users for a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 banned users.
   *
   * @param subreddit The name of the subreddit to get banned users for.
   *
   * @returns A listing of banned users.
   */
  getBannedUsers(subreddit: string): Listing<BannedUser> {
    return new BannedUserListing(fakeListingAfter(""), {
      request: { url: `r/${subreddit}/about/banned`, query: {} },
      client: this.client,
    });
  }

  /**
   * Mute a user in a subreddit.
   *
   * This prevents the user from sending modmail to the subreddit for 72 hours.
   *
   * @param subreddit The name of the subreddit to mute the user in.
   * @param username The username of the user to mute.
   */
  async muteUser(subreddit: string, username: string): Promise<void> {
    await this.friend(subreddit, username, "muted");
  }

  /**
   * Unmute a user in a subreddit.
   *
   * @param subreddit The name of the subreddit to unmute the user in.
   * @param username The username of the user to unmute.
   */
  async unmuteUser(subreddit: string, username: string): Promise<void> {
    await this.unfriend(subreddit, username, "muted");
  }

  /**
   * Get the list of muted users for a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 muted users.
   *
   * @param subreddit The name of the subreddit to get muted users for.
   *
   * @returns A listing of muted users.
   */
  getMutedUsers(subreddit: string): Listing<ModeratorActionedUser> {
    return new ModeratorActionedUserListing(fakeListingAfter(""), {
      request: { url: `r/${subreddit}/about/muted`, query: {} },
      client: this.client,
    });
  }

  /**
   * Ban a user from editing a subreddit's wiki.
   *
   * @param subreddit The name of the subreddit to wikiban the user in.
   * @param username The username of the user to wikiban.
   */
  async wikibanUser(subreddit: string, username: string): Promise<void> {
    await this.friend(subreddit, username, "wikibanned");
  }

  /**
   * Unban a user from editing a subreddit's wiki
   *
   * @param subreddit The name of the subreddit to wikiban the user in.
   * @param username The username of the user to wikiban.
   */
  async unwikibanUser(subreddit: string, username: string): Promise<void> {
    await this.unfriend(subreddit, username, "wikibanned");
  }

  /**
   * Get the list of wikibanned users for a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 wikibanned users.
   *
   * @param subreddit The name of the subreddit to get wikibanned users for.
   *
   * @returns A listing of wikibanned users.
   */
  getWikibannedUsers(subreddit: string): Listing<BannedUser> {
    return new BannedUserListing(fakeListingAfter(""), {
      request: { url: `r/${subreddit}/about/wikibanned`, query: {} },
      client: this.client,
    });
  }

  /**
   * Get the list of moderators for a subreddit.
   *
   * @param subreddit The name of the subreddit to get moderators for.
   *
   * @returns A listing of moderators.
   */
  async getModerators(subreddit: string): Promise<Moderator[]> {
    const result = await this.gateway.get<RedditObject>(
      `r/${subreddit}/about/moderators`
    );
    assertKind("UserList", result);
    const moderators = result.data.children as Data[];
    return moderators.map(m => new Moderator(fromRedditData(m)));
  }

  /** @internal */
  protected getSortedPosts(
    subreddit: string | undefined,
    sort: PostSort,
    options: Query = {}
  ): Listing<Post> {
    const url = subreddit ? `r/${subreddit}/` : "";
    const request = {
      url: `${url}${sort}`,
      query: { show: "all", ...options },
    };
    const context = { request, client: this.client };
    return new PostListing(fakeListingAfter(""), context);
  }

  /**
   * Get the posts in a subreddit, sorted by new.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   *
   * @returns A listing of posts, with the newest ones first.
   */
  getNewPosts(subreddit?: string): Listing<Post> {
    return this.getSortedPosts(subreddit, "new");
  }

  /**
   * Get the posts in a subreddit, sorted by top.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   * @param time The time scale to filter by.
   *
   * @returns A listing of posts, with the top rated ones first.
   */
  getTopPosts(subreddit?: string, time: TimeRange = "all"): Listing<Post> {
    return this.getSortedPosts(subreddit, "top", { t: time });
  }

  /**
   * Get the posts in a subreddit, sorted by hot.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   *
   * @returns A listing of posts, with the hottest ones first.
   */
  getHotPosts(subreddit?: string): Listing<Post> {
    return this.getSortedPosts(subreddit, "hot");
  }

  /**
   * Get the posts in a subreddit, sorted by rising.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   *
   * @returns A listing of posts, with the rising ones first.
   */
  getRisingPosts(subreddit?: string): Listing<Post> {
    return this.getSortedPosts(subreddit, "hot");
  }

  /**
   * Get the posts in a subreddit, sorted by controversial.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   * @param time The time scale to filter by.
   *
   * @returns A listing of posts, with the most controversial ones first.
   */
  getControversialPosts(
    subreddit?: string,
    time: TimeRange = "all"
  ): Listing<Post> {
    return this.getSortedPosts(subreddit, "controversial", { t: time });
  }

  /** @internal */
  protected getSubreddits(where: string): Listing<Subreddit> {
    const request = {
      url: `subreddits/${where}`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      query: { show: "all", sr_detail: true },
    };
    const context = { request, client: this.client };
    return new SubredditListing(fakeListingAfter(""), context);
  }

  /**
   * Get the list of default subreddits.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 subreddits.
   *
   * @returns A Listing of Subreddits.
   */
  getDefault(): Listing<Subreddit> {
    return this.getSubreddits("default");
  }

  /**
   * Get the newest subreddits.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 subreddits.
   *
   * @returns A Listing of Subreddits.
   */
  getNew(): Listing<Subreddit> {
    return this.getSubreddits("new");
  }

  /**
   * Get the most popular subreddits.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 subreddits.
   *
   * @returns A Listing of Subreddits.
   */
  getPopular(): Listing<Subreddit> {
    return this.getSubreddits("popular");
  }

  /**
   * Get the list of premium-only subreddits.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 subreddits.
   *
   * @returns A Listing of Subreddits.
   */
  getPremium(): Listing<Subreddit> {
    return this.getSubreddits("premium");
  }

  /** @internal */
  protected getAboutListing(
    subreddit: string,
    type: string
  ): Listing<Comment | Post> {
    const request = { url: `r/${subreddit}/about/${type}`, query: {} };
    const context = { request, client: this.client };
    return new PostOrCommentListing(fakeListingAfter(""), context);
  }

  /** @internal */
  protected getAboutListingComments(
    subreddit: string,
    type: string
  ): Listing<Comment> {
    const request = {
      url: `r/${subreddit}/about/${type}`,
      query: { only: "comments" },
    };
    const context = { request, client: this.client };
    return new CommentListing(fakeListingAfter(""), context);
  }

  /** @internal */
  protected getAboutListingPosts(
    subreddit: string,
    type: string
  ): Listing<Post> {
    const request = {
      url: `r/${subreddit}/about/${type}`,
      query: { only: "links" },
    };
    const context = { request, client: this.client };
    return new PostListing(fakeListingAfter(""), context);
  }

  /**
   * Get the list of flair templates for a subreddit.
   * @param subreddit The name of the subreddit.
   *
   * @returns A promise that resolves to a list of flair templates.
   */
  async getLinkFlairTemplates(subreddit: string): Promise<SubredditFlair[]> {
    const raw = await this.gateway.get<Data[]>(
      `r/${subreddit}/api/link_flair_v2.json`
    );
    return raw.map((flair: Data) => fromRedditData(flair));
  }

  /**
   * Get the list of items that have been removed from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that have been removed.
   */
  getSpam(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "spam");
  }

  /**
   * Get the list of comments that have been removed from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that have been removed.
   */
  getSpamComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "spam");
  }

  /**
   * Get the list of posts that have been removed from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that have been removed.
   */
  getSpamPosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "spam");
  }

  /**
   * Get the list of items that have been edited from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that have been edited.
   */
  getEdited(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "edited");
  }

  /**
   * Get the list of comments that have been edited from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that have been edited.
   */
  getEditedComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "edited");
  }

  /**
   * Get the list of posts that have been edited from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that have been edited.
   */
  getEditedPosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "edited");
  }

  /**
   * Get the list of items that have been reported from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that have been reported.
   */
  getReported(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "reports");
  }

  /**
   * Get the list of comments that have been reported from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that have been reported.
   */
  getReportedComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "reports");
  }

  /**
   * Get the list of posts that have been reported from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that have been reported.
   */
  getReportedPosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "reports");
  }

  /**
   * Get the list of items that have not been moderated from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that have not been moderated.
   */
  getUnmoderated(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "unmoderated");
  }

  /**
   * Get the list of comments that have not been moderated from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that have not been moderated.
   */
  getUnmoderatedComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "unmoderated");
  }

  /**
   * Get the list of posts that have not been moderated from a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that have not been moderated.
   */
  getUnmoderatedPosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "unmoderated");
  }

  /**
   * Get the list of items that are in the modqueue of a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of items that are in the modqueue.
   */
  getModqueue(subreddit: string): Listing<Post | Comment> {
    return this.getAboutListing(subreddit, "modqueue");
  }

  /**
   * Get the list of comments that are in the modqueue of a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of comments that are in the modqueue.
   */
  getModqueueComments(subreddit: string): Listing<Comment> {
    return this.getAboutListingComments(subreddit, "modqueue");
  }

  /**
   * Get the list of posts that are in the modqueue of a subreddit.
   *
   * @param subreddit The name of the subreddit.
   *
   * @returns A listing of posts that are in the modqueue.
   */
  getModqueuePosts(subreddit: string): Listing<Post> {
    return this.getAboutListingPosts(subreddit, "modqueue");
  }

  /**
   * Get the ID of a random post.
   *
   * @param subreddit The name of the subreddit. If this is left off it will
   * query the front page of Reddit.
   *
   * @returns A promise that resolves to a random post ID.
   */
  async getRandomPostId(subreddit?: string): Promise<string> {
    const base = subreddit ? `r/${subreddit}/` : "";

    // Reddit implemented '/random' by redirecting (302) to a random post.
    const postInfo: RedditObject<{ location: string }> = await this.gateway.get(
      `${base}random`
    );
    assertKind("snoots_redirect", postInfo);

    // Extract the post ID from the redirect URI.
    const postUrl = postInfo.data.location;
    const match = randomRedirectPattern.exec(postUrl);
    if (!match) throw new Error(`Invalid redirect URI '${postUrl}'`);
    return match[1];
  }

  /**
   * Search in a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 posts.
   *
   * @param subreddit The subreddit to search in.
   * @param query The search query.
   * @param time The time range to search in.
   * @param sort The way to sort the search results.
   * @param syntax The search syntax to use.
   *
   * @returns A listing of posts.
   */
  search(
    subreddit: string,
    query: string,
    time: TimeRange = "all",
    sort: SearchSort = "relevance",
    syntax: SearchSyntax = "plain"
  ): Listing<Post> {
    return this.client.posts.search(query, subreddit, time, sort, syntax, true);
  }

  /**
   * Get a Listing of all the comments in a subreddit.
   *
   * @note Due to the way Reddit implements Listings, this will only contain the
   * first 1000 comments.
   *
   * @param subreddit The subreddit to get comments from. If this is not
   * provided comments will be fetched from the front page of Reddit.
   * @param sort How to sort the comments.
   *
   * @returns A sorted Listing of comments.
   */
  // TODO: allow other sorting?
  getSortedComments(subreddit: string, sort: "new" = "new"): Listing<Comment> {
    const url = subreddit ? `r/${subreddit}/` : "";
    const request = { url: `${url}comments`, query: { sort } };
    const context = { request, client: this.client };
    return new CommentListing(fakeListingAfter(""), context);
  }

  /**
   * Submit a text post.
   *
   * @param subreddit The subreddit to submit the post to.
   * @param title The title of the post.
   * @param body The body of the post.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postText(
    subreddit: string,
    title: string,
    body?: string,
    options: TextPostOptions = {}
  ): Promise<string> {
    return this.post(subreddit, {
      kind: "self",
      title,
      text: body,
      sendReplies: options.sendReplies ?? false,
      resubmit: true,
      captcha: options.captcha,
      nsfw: options.nsfw ?? false,
      spoiler: options.spoiler ?? false,
    });
  }

  /**
   * Submit a link post.
   *
   * @param subreddit The subreddit to submit the post to.
   * @param title The title of the post.
   * @param url The url to link to.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postLink(
    subreddit: string,
    title: string,
    url: string,
    options: LinkPostOptions = {}
  ): Promise<string> {
    return this.post(subreddit, {
      kind: "link",
      title,
      url,
      sendReplies: options.sendReplies ?? false,
      resubmit: !options.unique,
      captcha: options.captcha,
      nsfw: options.nsfw ?? false,
      spoiler: options.spoiler ?? false,
    });
  }

  /**
   * Submit an image post.
   * @param subreddit The subreddit to submit the post to.
   * @param title The title of the post.
   * @param imageFile The image file to post.
   * @param imageFileName The name of the image file.
   * @param noWebsockets Whether to disable websockets for the image.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post or undefined
   */
  async postImage(
    subreddit: string,
    title: string,
    imageFile: Blob,
    imageFileName: string,
    noWebsockets = false,
    options: LinkPostOptions = {}
  ): Promise<string | undefined> {
    let url, websocketUrl;
    try {
      const image =
        imageFile instanceof MediaImg
          ? imageFile
          : await this.uploadMedia({
              file: imageFile,
              name: imageFileName,
              type: "img",
            });
      debug("Image upload response %o", image);
      url = image?.fileUrl;
      websocketUrl = image?.websocketUrl;
    } catch (error) {
      debug("Failed to upload image: %o", error);
      throw new Error(`Failed to upload image: ${(error as Error).message}`);
    }
    try {
      return this.post(subreddit, {
        title,
        kind: "image",
        url,
        websocketUrl: noWebsockets ? undefined : websocketUrl,
        sendReplies: options.sendReplies ?? false,
        resubmit: !options.unique,
        captcha: options.captcha,
        nsfw: options.nsfw ?? false,
        spoiler: options.spoiler ?? false,
      });
    } catch (error) {
      debug("Failed to post image: %o", error);
      throw new Error(`Failed to post image: ${(error as Error).message}`);
    }
  }

  /** @internal */
  async uploadMedia({
    file,
    name,
    type,
    caption,
    outboundUrl,
    validateOnly = false,
  }: UploadMediaOptions) {
    this.validateFile(file, type);
    if (validateOnly) {
      return;
    }
    const parsedFile =
      typeof file === "string" ? fs && fs.createReadStream(file) : file;
    const fileName =
      typeof file === "string"
        ? path.basename(file)
        : (file as { name?: string }).name || name;
    const uploadResponse = (await this.getUploadResponse(
      parsedFile,
      type,
      fileName
    )) as UploadResponse;

    debugUpload("Upload response %o", uploadResponse);
    const uploadURL = "https:" + uploadResponse.args.action;
    debugUpload("Upload URL %o", uploadURL);
    const fileDetails: FileDetails = {
      fileUrl: uploadURL + "/" + uploadResponse.asset.asset_id,
      mediaId: uploadResponse.asset.asset_id,
      websocketUrl: uploadResponse.asset.websocket_url,
      caption,
      outboundUrl,
    };
    debugUpload("File details %o", fileDetails);
    const formData = new FormData();
    for (const item of uploadResponse.args.fields) {
      formData.append(item.name, item.value);
    }
    formData.set(
      "file",
      parsedFile instanceof stream.Readable
        ? ((await blob(parsedFile)) as Blob)
        : parsedFile,
      fileName
    );
    debugUpload("Form data %o", formData);
    const response = isBrowser
      ? await fetch(uploadURL, {
          method: "post",
          mode: "no-cors",
          body: formData as never,
        })
      : await this.gateway.postUpload(uploadURL, formData);
    debugUpload("Upload response %o", response);
    return this.createMedia(fileDetails, type);
  }

  private validateFile(file: unknown, type?: string) {
    if (isBrowser && !fetch) {
      throw new Error("Your browser doesn\\'t support \\'no-cors\\' requests");
    }
    if (isBrowser && typeof file === "string") {
      throw new Error("File cannot be a string in the browser");
    }
    if (
      typeof file !== "string" &&
      !(stream && file instanceof stream.Readable) &&
      !(Blob && file instanceof Blob)
    ) {
      throw new Error(
        "'options.file' must be one of: 'string', 'stream.Readable', 'Blob', or a 'File'"
      );
    }
    debugUpload("Validated file %o", { file, type });
  }

  private async getUploadResponse(
    file: Blob | stream.Readable,
    type: UploadMediaOptions["type"],
    fileName?: string
  ) {
    if (!fileName) {
      throw new Error("File name is required");
    }
    const fileExtension = path.extname(fileName).replace(".", "") || "jpeg";
    const mimetype =
      Blob && file instanceof Blob
        ? file.type || mimeTypes[fileExtension as keyof typeof mimeTypes]
        : "";
    const expectedPrefix = mediaTypes[type!];
    if (expectedPrefix && mimetype.split("/")[0] !== expectedPrefix) {
      throw new Error(
        `Expected a MIMETYPE for the file '${fileName}' starting with '${expectedPrefix}' but got '${mimetype}'`
      );
    }
    return await this.gateway.post("api/media/asset.json", {
      filepath: fileName,
      mimetype,
    });
  }

  private createMedia(details: FileDetails, type?: string) {
    switch (type) {
      case "img":
        return new MediaImg(details);
      case "video":
        return new MediaVideo(details);
      case "gif":
        return new MediaGif(details);
      default:
        return new MediaFile(details);
    }
  }

  /**
   * Submit a crosspost.
   *
   * @param subreddit The subreddit to submit the post to.
   * @param title The title of the post.
   * @param postID The ID of the post to crosspost.
   * @param options Any extra options.
   *
   * @returns A promise that resolves to the ID of the new post.
   */
  async postCrosspost(
    subreddit: string,
    title: string,
    postID: string,
    options: LinkPostOptions = {}
  ): Promise<string> {
    return this.post(subreddit, {
      kind: "crosspost",
      title,
      crosspostFullname: `t3_${postID}`,
      sendReplies: options.sendReplies ?? false,
      resubmit: !options.unique,
      captcha: options.captcha,
      nsfw: options.nsfw ?? false,
      spoiler: options.spoiler ?? false,
    });
  }

  // TODO: Support 'oc' and flairs.
  protected async post(
    subreddit: string,
    options: PostOptions
  ): Promise<string> {
    let ws: InstanceType<typeof webSocket> | undefined;
    if (options.websocketUrl) {
      ws = (await this.initializeWebSocket(
        options.websocketUrl
      )) as InstanceType<typeof webSocket>;
    }

    debugPost("Posting to %s with options %o", subreddit, options);

    const request: Data = this.createRequestData(subreddit, options);

    if (ws) {
      debugPost("Using websocket to post");
      await this.handleRegularPost(request);
      const submissionId = await this.handleWebSocketPost(ws);
      debugPost("Submission ID: %s", submissionId);
      return submissionId;
    } else {
      debugPost("Handling regular post.");
      return await this.handleRegularPost(request);
    }
  }

  private async initializeWebSocket(websocketUrl: string): Promise<unknown> {
    const ws = new webSocket(websocketUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve);
      ws.addEventListener("error", () =>
        reject(new Error("Failed to open websocket"))
      );
    });
    return ws;
  }

  private createRequestData(subreddit: string, options: PostOptions): Data {
    const request: Data = {
      sr: subreddit,
      kind: options.kind,
      title: options.title,
      sendreplies: options.sendReplies,
      resubmit: options.resubmit,
      nsfw: options.nsfw,
      spoiler: options.spoiler,
    };

    if (options.text != undefined) request.text = options.text;
    if (options.url != undefined) request.url = options.url;
    if (options.crosspostFullname != undefined)
      request.crosspost_fullname = options.crosspostFullname;
    if (options.captcha != undefined) {
      request.captcha = options.captcha.response;
      request.iden = options.captcha.iden;
    }

    return request;
  }

  private async handleWebSocketPost(ws: WebSocket): Promise<string> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        debugPost("Timing out websocket");
        ws.close();
        reject(
          new Error(
            "Websocket timed out. Your post may still have been created."
          )
        );
      }, 10_000);
      debugPost("Handling websocket post");
      if (ws.readyState !== webSocket.OPEN) {
        debugPost("Websocket not open. Falling back to regular post.");
        reject(
          new Error("Websocket error. Your post may still have been created.")
        );
      }

      ws.addEventListener("message", (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string) as {
            type: string;
            payload: { redirect: string };
          };
          debugPost("Websocket message %o", data);
          if (data.type === "failed") {
            ws.close();
            reject(new Error("Failed to create post."));
          }
          const submissionUrl = data.payload.redirect;
          ws.removeEventListener("message", reject);
          resolve(submissionIdRegex.exec(submissionUrl)![1]);
        } catch (error) {
          debugPost("Failed to parse websocket message %o", error);
          reject(new Error("Failed to create post."));
        } finally {
          debugPost("Removing event listeners");
          ws.removeEventListener("close", reject);
          clearTimeout(timer);
          ws.close();
        }
      });
      ws.addEventListener("error", () => {
        debugPost("Websocket error. Falling back to regular post.");
        reject(
          new Error(`Websocket error. Your post may still have been created.`)
        );
        ws.removeEventListener("close", reject);
      });
      ws.addEventListener("close", () => {
        debugPost("Websocket closed.");
        reject(
          new Error(`Websocket closed. Your post may still have been created.`)
        );
      });
    });
  }

  private async handleRegularPost(request: Data): Promise<string> {
    const submitResponse: Data = await this.gateway.post("api/submit", request);
    debugPost("Submit response %o", submitResponse);
    return submitResponse.id as string;
  }

  /** @internal */
  protected async friend(
    subreddit: string,
    username: string,
    type: string,
    options: Query = {}
  ) {
    await this.gateway.post(`r/${subreddit}/api/friend`, {
      ...options,
      name: username,
      type,
    });
  }

  /** @internal */
  protected async unfriend(
    subreddit: string,
    username: string,
    type: string,
    options: Query = {}
  ) {
    await this.gateway.post(`r/${subreddit}/api/unfriend`, {
      ...options,
      name: username,
      type,
    });
  }

  /** @internal */
  fromRaw(raw: RedditObject): Subreddit {
    assertKind("t5", raw);

    const rDat = raw.data;

    // Rename properties.
    rDat.sidebar = rDat.description as string;
    rDat.sidebar_html = rDat.description_html as string;
    rDat.description = rDat.public_description as string;
    rDat.description_html = rDat.public_description_html as string;

    const data: SubredditData = fromRedditData(rDat);
    return new Subreddit(this, data);
  }
}
