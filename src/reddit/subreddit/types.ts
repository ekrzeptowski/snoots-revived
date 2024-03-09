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

export interface SubredditFlair {
  text: string;
  cssClass: string;
  id: string;
  textEditable: boolean;
  type: "text" | "richtext";
  allowableContent: string;
  textColor: "dark" | "light";
  modOnly: boolean;
  richtext?: {
    e: "text";
    t: string;
  }[];
  backgroundColor: string;
}
