/** The type of subreddit. */
export type SubredditType =
  | "gold_restricted"
  | "archived"
  | "restricted"
  | "employees_only"
  | "gold_only"
  | "private"
  | "user"
  | "public";

export type FileDetails = {
  websocketUrl: string;
  outboundUrl: string | undefined;
  caption: string | undefined;
  fileUrl: string;
  mediaId: string;
};

/** The type of subreddit flair. */
export interface SubredditFlair {
  /** The flair text. */
  text: string;
  /** CSS class for the flair. */
  cssClass: string;
  /** The flair ID. */
  id: string;
  /** If the flair is editable. */
  textEditable: boolean;
  /** The flair type. */
  type: "text" | "richtext";
  /** Specifies allowed content for the flair. */
  allowableContent: string;
  /** The flair text color. */
  textColor: "dark" | "light";
  /** If the flair is mod only. */
  modOnly: boolean;
  /** Richtext flair. */
  richtext?: {
    /** The flair type. */
    e: "text";
    /** The flair text. */
    t: string;
  }[];
  /** The flair background color. */
  backgroundColor: string;
}
