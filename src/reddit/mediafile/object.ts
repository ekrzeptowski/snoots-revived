/**
 * @internal
 * @summary An Interface representing parameters to pass to the {@link MediaFile} constructor.
 */
export interface FileDetails {
  /**
   * @summary A direct URL to the uploaded file. Used to embed the file on image/video submissions.
   */
  fileUrl: string;
  /**
   * @summary A unique identifier for the uploaded file. Used to embed the file on selfposts and galleries.
   */
  mediaId: string;
  /**
   * @summary The websocket URL can be used to determine when media processing is finished and to obtain the newly created submission ID.
   */
  websocketUrl?: string;
  /**
   * @summary A caption for the embedded file to be used on selfposts bodies and gallery items.
   * @desc **NOTE**: Captions on gallery items must be 180 characters or less.
   */
  caption?: string;
  /**
   * @summary An external URL to be used on gallery items.
   */
  outboundUrl?: string;
}

/**
 * @internal
 * A class representing media files uploaded to reddit to be embedded on
 * submissions.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MediaFile extends FileDetails {}
/** @internal */
export class MediaFile {
  /**
   * @summary The media type. Only available on {@link MediaImg}, {@link MediaVideo} and {@link MediaGif}.
   */
  type?: string;

  /**
   * @summary Constructs a new media file. In most cases you should call {@link SubredditControls#uploadMedia} instead.
   * @param options An object containing `fileUrl`, `mediaId` along with optional `websocketUrl`, `caption` and `outboundUrl`.
   */
  constructor({
    fileUrl,
    mediaId,
    websocketUrl,
    caption,
    outboundUrl,
  }: FileDetails) {
    this.fileUrl = fileUrl;
    this.mediaId = mediaId;
    this.websocketUrl = websocketUrl;
    this.caption = caption;
    this.outboundUrl = outboundUrl;
  }

  /**
   * @summary This method allows to embed media files on selfposts bodies. This only works with {@link MediaImg}, {@link MediaVideo}
   * and {@link MediaGif} where the `type` property is set.
   * @desc **NOTE**: Embedded media will have a padding of `\n\n` automatically added. This is due to the weirdness with Reddit's API.
   * @returns {string} A string representation of the media file in Markdown format.
   * @example
   *
   * const mediaImg = await r.uploadMedia({ // Usage as a `MediaImg`.
   *   file: './image.png',
   *   type: 'img',
   *   caption: 'optional caption'
   * })
   *
   * const body = `This is an inline image: ${mediaImg} Cool huh?`
   * => "This is an inline image: \n\n![img](qwertyuiop \"optional
   * caption\")\n\n Cool huh?"
   */
  toString(): string {
    return this.type
      ? `\n\n![${this.type}](${this.mediaId} "${this.caption ?? ""}")\n\n`
      : "";
  }
}

/** @internal */
export class MediaImg extends MediaFile {
  /** Sets type to img */
  override type = "img";
}

/** @internal */
export class MediaVideo extends MediaFile {
  /** Sets type to video */
  override type = "video";
}

/** @internal */
export class MediaGif extends MediaVideo {
  /** Sets type to gif  */
  override type = "gif";
}
