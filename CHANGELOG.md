## [1.0.0-dev.3](https://github.com/ekrzeptowski/snoots-revived/compare/v1.0.0-dev.2...v1.0.0-dev.3) (2024-03-14)


### Features

* add a way to post with a flair ([148632c](https://github.com/ekrzeptowski/snoots-revived/commit/148632c671d05057c5a275405084323012a173c9))

## [1.0.0-dev.2](https://github.com/ekrzeptowski/snoots-revived/compare/v1.0.0-dev.1...v1.0.0-dev.2) (2024-03-12)


### Features

* add a way to get post requirements ([c36e742](https://github.com/ekrzeptowski/snoots-revived/commit/c36e7421564e2ff9dcd71342eeea91871bd03839))

## 1.0.0-dev.1 (2024-03-11)


### ⚠ BREAKING CHANGES

* `Client.users.fetchMe()` is now `Client.me.fetch()`.
* `getRandomPost()` replace with `getRandomPostId()`.
* Removed the following methods from Subreddit and
SubredditControls pending finding a way to make them work:
- getContributors()
- getWikiContributors()
- getMutedUsers()
- getWikibannedUsers()
- getModerators()
- getBannedUsers()
* Renamed type `Capcha` -> `Captcha` (fixed typo).
* `Post.thumbnailHeight` and `Post.thumbnailWidth` have
been temporarily removed. They were not yet supposed to be exposed, but
they slipped through the cracks.
* There is no longer a default export. If you are using
TypeScript or ESM switch from using `import Client from "snoots"` to
using `import { Client } from "snoots"`. If you are using CommonJS
switch from `const Client = require("snoots")` to
`const { Client } = require("snoots")`, or to
`const Client = require("snoots").Client`.
* All internal usages of `null` have been replaced with
`undefined`. This includes mapping `null` to `undefined` in Reddit's API
responses. If you were checking any values for existence with `=== null`
you should replace that check with `=== undefined` (or `== null` or
`== undefined`).
* `Client.authFromCode()` has been replaced with
`Client.fromAuthCode()`.
* `Client.getAuthUrl()` has been renamed to
`Client.makeAuthUrl()`.
* This renames Listing.each to Listing.forEach, and
it is now no longer the preferred method of iteration. Instead you
should probably use `for await` loops.

### Features

* add a base data object ([74637d8](https://github.com/ekrzeptowski/snoots-revived/commit/74637d84b6282e1fa06cb49356c451149953466e))
* add a function to approve an item ([11cde28](https://github.com/ekrzeptowski/snoots-revived/commit/11cde2862bd4c7dd27f80ba18776ceae9e86e159))
* add a function to distinguish a comment ([e4c681f](https://github.com/ekrzeptowski/snoots-revived/commit/e4c681f82966185241e7d88c397d4b616ca1a397))
* add a function to update the client's token ([3964f7a](https://github.com/ekrzeptowski/snoots-revived/commit/3964f7a6c1419e2d49a1fe878e2b4eedec096d82))
* add a helper function for crossposting ([19b7fc5](https://github.com/ekrzeptowski/snoots-revived/commit/19b7fc57a76fb38047bd1f749560476d88a47f99))
* add a helper to check if any items match ([3f9403d](https://github.com/ekrzeptowski/snoots-revived/commit/3f9403d3ad50b426bb8d817a3803ec9fa5072fb7))
* add a helper to get the first item from a Listing ([61e8e35](https://github.com/ekrzeptowski/snoots-revived/commit/61e8e35b99a05a590101262ba276b704afa5b915))
* add a method to (re)authorize a client ([d86550d](https://github.com/ekrzeptowski/snoots-revived/commit/d86550d0e7aef8cfbdaa8333d45207119cf9c2e5))
* add a method to get the approved contributors in a subreddit ([c1edba2](https://github.com/ekrzeptowski/snoots-revived/commit/c1edba2c48bcd1dc21be8e105bc96d91d1aef74f)), closes [#49](https://github.com/ekrzeptowski/snoots-revived/issues/49)
* add a method to remove an item ([6e77a74](https://github.com/ekrzeptowski/snoots-revived/commit/6e77a74344a350a1ffcadb58ad091d64ca4e329f))
* add a way to execute a function on each page of a listing ([313c4af](https://github.com/ekrzeptowski/snoots-revived/commit/313c4af73b1a1147dc0393afbc63d310d7f8b377))
* add a way to get banned users ([de2f41b](https://github.com/ekrzeptowski/snoots-revived/commit/de2f41b338f454fd0a8310b94bc688d7d2c8686a))
* add a way to get muted users ([f4d9500](https://github.com/ekrzeptowski/snoots-revived/commit/f4d9500defe46553d3c0910732c9e0e90f3cfcf5))
* add a way to get subreddit contributors ([b0f7cef](https://github.com/ekrzeptowski/snoots-revived/commit/b0f7cefa54e4b077b693aa04431363bbebd34062)), closes [#49](https://github.com/ekrzeptowski/snoots-revived/issues/49)
* add a way to get the approved wiki contributors for a subreddit ([aaf06e7](https://github.com/ekrzeptowski/snoots-revived/commit/aaf06e733681f6bf2353812c2d036e191d3db6ea))
* add a way to get the last-known rate limit status for a client ([20f285f](https://github.com/ekrzeptowski/snoots-revived/commit/20f285f812bf5412a4f60aca25dca843121246b6))
* add a way to get the list of moderators ([7cad99f](https://github.com/ekrzeptowski/snoots-revived/commit/7cad99fc48de8c56ba72781087e5c7ca0600ea0a))
* add a way to get the list of moderators in a subreddit ([8e1fea9](https://github.com/ekrzeptowski/snoots-revived/commit/8e1fea9f4ca4291eb51eb6b69ccdec6dea29a255))
* add a way to get the refresh token ([e55b9e2](https://github.com/ekrzeptowski/snoots-revived/commit/e55b9e2088b780d7b05fb5ac1360a7616b980741))
* add a way to get the users banned from a subreddit ([85831df](https://github.com/ekrzeptowski/snoots-revived/commit/85831df2a8e8486f59741360c0f7a31227f5f9e9))
* add a way to get wiki contributors ([03ab9ef](https://github.com/ekrzeptowski/snoots-revived/commit/03ab9efc77c491d96c1a62b220ab2ff464e3de85))
* add a way to get wikibanned users ([7e4e603](https://github.com/ekrzeptowski/snoots-revived/commit/7e4e60315576e1634a17d9c8402b5fe689df11e2))
* add a way to manage wikibanned users in a subreddit ([8abe658](https://github.com/ekrzeptowski/snoots-revived/commit/8abe658a863bd246f4e09d1a0b73d5acc3bb7c00))
* add a way to post a gallery ([481b5b8](https://github.com/ekrzeptowski/snoots-revived/commit/481b5b82ad589ee4e3c21c33933cbfb563ade92c))
* add a way to post a video ([964b934](https://github.com/ekrzeptowski/snoots-revived/commit/964b934fb0d02a950cb033ad26aae909ef9d72eb))
* add a way to post image ([0ff7bd1](https://github.com/ekrzeptowski/snoots-revived/commit/0ff7bd176fe9c9046b99852a3c5d521a47ef7e59))
* add a way to reply to content ([f5cbf7e](https://github.com/ekrzeptowski/snoots-revived/commit/f5cbf7e79fa9d929f6ca72082bf4c2e51c126cd9))
* add a way to search posts ([00c48ec](https://github.com/ekrzeptowski/snoots-revived/commit/00c48ec7747f555dbc00065f5854e0cbf5dc82e3))
* add banNote ([6892f44](https://github.com/ekrzeptowski/snoots-revived/commit/6892f44a4c5f05a877e03c1ca64b291707a8c7b8))
* add base listing implementation ([90b8f2a](https://github.com/ekrzeptowski/snoots-revived/commit/90b8f2a7ad70780b4474b155aa9b2857b35409db))
* add base type for votable objects ([2da716c](https://github.com/ekrzeptowski/snoots-revived/commit/2da716c116740e2b061c6857ffebcddfc0a3d39a))
* add blockAuthor() ([58feff1](https://github.com/ekrzeptowski/snoots-revived/commit/58feff1f1ab3962a009c44efae8334805c9c4ccf))
* add client-authorized api wrapper ([22c7f87](https://github.com/ekrzeptowski/snoots-revived/commit/22c7f874db3c3567b8a6701836f762ad044eb32e))
* add Client.getAuthorizedScopes() ([1cdcac2](https://github.com/ekrzeptowski/snoots-revived/commit/1cdcac2e2b7c3f9fb1d9685f8935ac3c304483f6)), closes [#43](https://github.com/ekrzeptowski/snoots-revived/issues/43)
* add controls for interacting with comments ([6f7b81e](https://github.com/ekrzeptowski/snoots-revived/commit/6f7b81e7d3dbacb20dd22c30549af8bbce88123a))
* add controls for interacting with voteable objects ([8c08cbc](https://github.com/ekrzeptowski/snoots-revived/commit/8c08cbc1556ee70e1461666948e2938c93c6d8c1))
* add controls to managing muted users in a subreddit ([d057dc0](https://github.com/ekrzeptowski/snoots-revived/commit/d057dc0ad1b74981eea384a7d717874d141273e3))
* add core api wrapper ([75fbc27](https://github.com/ekrzeptowski/snoots-revived/commit/75fbc273e78f4a6f645d92d8ac2490f58949f22e))
* add debug logging for rate limit status ([7ef9e83](https://github.com/ekrzeptowski/snoots-revived/commit/7ef9e834915a2ea33dbe379bc136b24bfc367028))
* add dismissedUserReports ([daa9aac](https://github.com/ekrzeptowski/snoots-revived/commit/daa9aaceef681500706315ece6ec94ab874448df))
* add getLinkFlairTemplates ([9b89463](https://github.com/ekrzeptowski/snoots-revived/commit/9b8946362dc28aa739365c335dc5938c18e131d8))
* add getters for moderation listings ([1c3876e](https://github.com/ekrzeptowski/snoots-revived/commit/1c3876e56cc5b8816354392f8e7bbdf601ee272f))
* add helper function to update an oauth token ([507d61c](https://github.com/ekrzeptowski/snoots-revived/commit/507d61c9735765ff8618baa465615b30d43acff4))
* add helper functions to Voteable ([aa0ca66](https://github.com/ekrzeptowski/snoots-revived/commit/aa0ca66b85e417f1f55eb20d936e112cd77010e9))
* add helper get() and post() methods ([29f4876](https://github.com/ekrzeptowski/snoots-revived/commit/29f48765a5178e98c41e21cd12ecad882235cf5a))
* add helper to camelCase the keys in an object ([b5e5c83](https://github.com/ekrzeptowski/snoots-revived/commit/b5e5c83e12a42dd67dbad61fbf4e6eee082b56b7))
* add helper to split an array into sized groups ([ffbe5b1](https://github.com/ekrzeptowski/snoots-revived/commit/ffbe5b1a955d93ac9df63693d4eb2ed89affd296))
* add initial support for interacting with users ([bd0fc8b](https://github.com/ekrzeptowski/snoots-revived/commit/bd0fc8b01140aaab1b0b47eb6cdedb96a79c2b22))
* add initial support for Subreddits ([b5f09ea](https://github.com/ekrzeptowski/snoots-revived/commit/b5f09eafa1b1a3840a6d6b6864b82528a9c1893e))
* add missing functions to VoteableControls ([3dc79db](https://github.com/ekrzeptowski/snoots-revived/commit/3dc79dba3a39b8d5007f1a855c151cc747ab60f2))
* add MyUserControls::getContributorSubreddits() ([48f41c0](https://github.com/ekrzeptowski/snoots-revived/commit/48f41c02eb007aeb816d104bb41e182a3a9027f9))
* add MyUserControls::getModeratedSubreddits() ([291c74f](https://github.com/ekrzeptowski/snoots-revived/commit/291c74f9d6d419d0f417dfbc0950eb4c1c802ac3))
* add MyUserControls::getSubscribedSubreddits() ([2ff0f50](https://github.com/ekrzeptowski/snoots-revived/commit/2ff0f5006501884ef3ea43d4574c64e3ae620f1e))
* add oauth api wrapper ([0b6501e](https://github.com/ekrzeptowski/snoots-revived/commit/0b6501e7e8f7992f2d97ec5e50f00e59d135496d))
* add OAuth flow ([7029a16](https://github.com/ekrzeptowski/snoots-revived/commit/7029a16f3c0cf1af2face6baf8b9c0e1423606c5))
* add optional debugging via the `debug` module ([fbb7bb3](https://github.com/ekrzeptowski/snoots-revived/commit/fbb7bb31086d72c87c2c967a2bf58e3b8058ab81))
* add partial support for Posts ([808df45](https://github.com/ekrzeptowski/snoots-revived/commit/808df45279f6c5e3c5201a06c933c885b891c09e))
* add SubredditControls::getDefault() ([1d170a4](https://github.com/ekrzeptowski/snoots-revived/commit/1d170a4c9f25bf1f848b9fce1292cdd2fcaa60de))
* add SubredditControls::getNew() ([49be5ca](https://github.com/ekrzeptowski/snoots-revived/commit/49be5cab5c4b5a86e938578f7b74d5048a5a0136))
* add SubredditControls::getPopular() ([cc91c08](https://github.com/ekrzeptowski/snoots-revived/commit/cc91c081076d19518bbb4a729c952a179aebc8e7))
* add SubredditControls::getPremium() ([5a1274b](https://github.com/ekrzeptowski/snoots-revived/commit/5a1274b4309a936db825dacfa8951343898f09c2))
* add SubredditData.allow* ([f0c6b48](https://github.com/ekrzeptowski/snoots-revived/commit/f0c6b481f1d82102f5094dcc8dfb1aa5381fd0f8))
* add the ability to ignore reports on an item ([31f6cc1](https://github.com/ekrzeptowski/snoots-revived/commit/31f6cc1a21e289dc818ae7b8cb6c70bb63c2403c))
* add unauthorized api wrapper ([052c592](https://github.com/ekrzeptowski/snoots-revived/commit/052c5926d82ee031faf04558c6341346ed4c1cd9))
* add UserControls::isUsernameAvailable() ([3a56e77](https://github.com/ekrzeptowski/snoots-revived/commit/3a56e776534e23212f322d946ee487c88cf5abb3))
* add VoteableData.*ReportsDismissed ([41da3f1](https://github.com/ekrzeptowski/snoots-revived/commit/41da3f1ca85fcb796e9a54187e2682705440500e))
* allow application-only-auth ([487c5fd](https://github.com/ekrzeptowski/snoots-revived/commit/487c5fdb55af3bdffabce13bbeb4d549374aed89))
* allow getting and setting a post's suggested sort ([b6235b8](https://github.com/ekrzeptowski/snoots-revived/commit/b6235b83fccb0fa547f9ae8ef8e775acca7a7f3e))
* allow locking and unlocking comments ([766726b](https://github.com/ekrzeptowski/snoots-revived/commit/766726bb99b9fc0c23de235411e336440252977a))
* **docs:** update typedoc to 0.22 ([a8260d7](https://github.com/ekrzeptowski/snoots-revived/commit/a8260d7af94a20fad608beb3317d9f4999f178a6))
* document link flair templates ([29257d1](https://github.com/ekrzeptowski/snoots-revived/commit/29257d1f1456142d5b678cb9ebf759bd6c32620d))
* initial commit ([cedbf15](https://github.com/ekrzeptowski/snoots-revived/commit/cedbf1565672353a10713fa0d76c35953bc26ed9))
* make BaseControls::namespace() public ([f13d40b](https://github.com/ekrzeptowski/snoots-revived/commit/f13d40bc41f2254480a607c65c48b1f98ee59ef0))
* make calls to /random go entirely through OAuth ([87c9640](https://github.com/ekrzeptowski/snoots-revived/commit/87c9640c422a03111f35c53af7fd94625cc269fa))
* make Listings iterable ([868d58d](https://github.com/ekrzeptowski/snoots-revived/commit/868d58d06d5a38dd94e7d293d722d89f649e8b53))
* make the client take in options ([79875ab](https://github.com/ekrzeptowski/snoots-revived/commit/79875ab2633fc9b1c1eea00964a9cf0c50141cff))
* move all Reddit REST api interaction into new Gateway classes ([8c0856a](https://github.com/ekrzeptowski/snoots-revived/commit/8c0856a1d1098e8d49794fecdee1f300d6ed3ff4))
* remove CommentData.depth ([b5d6bf4](https://github.com/ekrzeptowski/snoots-revived/commit/b5d6bf47e34bf4078b6dfaba3f0f2023729730fd))
* remove default export ([3df8d41](https://github.com/ekrzeptowski/snoots-revived/commit/3df8d41a26b3f5d8f0bb59e55d9bcb44d86a3f35))
* remove subredditId ([431efe2](https://github.com/ekrzeptowski/snoots-revived/commit/431efe2fb35cbad8b9b4d72ab8f4c73e4ded9abe))
* rename Client.getAuthUrl() -> Client.makeAuthUrl() ([ba87fdf](https://github.com/ekrzeptowski/snoots-revived/commit/ba87fdfe1b5d9d300f140c1bb2a785b79e4565f8))
* replace `null` with `undefined` ([5ab17b6](https://github.com/ekrzeptowski/snoots-revived/commit/5ab17b61bb1051e7d6205eccbfc8facf10cc3121))
* replace Client.authFromCode() with Client.fromAuthCode() ([8fa90b8](https://github.com/ekrzeptowski/snoots-revived/commit/8fa90b810461dd739b10d51dcdad947424a571af))
* replace getRandomPost() with getRandomPostId() ([8f56359](https://github.com/ekrzeptowski/snoots-revived/commit/8f56359a4d5f950547e03be2ef8308b37d4e3cfe))
* start work on Client object ([4628499](https://github.com/ekrzeptowski/snoots-revived/commit/4628499799f28c5207e6159999accecfc34dbe58))


### Bug Fixes

* accurately reflect types of 'edited' ([65f94c7](https://github.com/ekrzeptowski/snoots-revived/commit/65f94c76e1959667b7e866d18e02145770e2d7cc))
* add a default sort to User(Controls).getPosts() ([7a20a03](https://github.com/ekrzeptowski/snoots-revived/commit/7a20a03194756955562f05e3fd5e7eeff63ad39f))
* batch comments 75 at a time ([d3cad93](https://github.com/ekrzeptowski/snoots-revived/commit/d3cad93f1b7fa0bf66dc46ebfc07d81ac6f7ad08))
* **deps:** update dependency got to ^11.8.6 ([82e6310](https://github.com/ekrzeptowski/snoots-revived/commit/82e631023ec8ee77c80508058916a01a4038b968))
* **deps:** update dependency tslib to ^2.4.1 ([afecdcf](https://github.com/ekrzeptowski/snoots-revived/commit/afecdcffacd0899b015f607bfac865e7e262c5a4))
* **deps:** update dependency tslib to ^2.5.0 ([7577950](https://github.com/ekrzeptowski/snoots-revived/commit/757795040ae1ec6e63e91103ccb4e10f157deca0))
* documentation of link flair templates ([d307909](https://github.com/ekrzeptowski/snoots-revived/commit/d307909aa8e2d92b361f597225f87078efaff3f2))
* documentation of subreddit flair ([5255fec](https://github.com/ekrzeptowski/snoots-revived/commit/5255fec7835ff1d3f03427c1823777d7fdd2cca8))
* export Replyable ([8fc0ddf](https://github.com/ekrzeptowski/snoots-revived/commit/8fc0ddf3e028c082f3ace118ff412e41614e4b09))
* export Subreddit ([1f6041d](https://github.com/ekrzeptowski/snoots-revived/commit/1f6041da5bf1f36c68a14bc4419740d767ef2619))
* fix error when submit response doesn't contain id ([8bb0b58](https://github.com/ekrzeptowski/snoots-revived/commit/8bb0b58d09efdf64da7ff858532deb0da2c29fb9))
* fix formatting of debug print ([3630026](https://github.com/ekrzeptowski/snoots-revived/commit/363002623e1ec17e480d8d4fc4d0a5201a9bf8b0))
* fix types of mod* attributes ([0db4994](https://github.com/ekrzeptowski/snoots-revived/commit/0db49946e2794b10d7d7d6041344f54dc7ead054))
* fix typo (Capcha -> Captcha) ([774866d](https://github.com/ekrzeptowski/snoots-revived/commit/774866d5392958dbdb7cd833ad76d0ae37182b5c))
* fix VoteableData.userReports' type ([df5301d](https://github.com/ekrzeptowski/snoots-revived/commit/df5301d4ee8e9a8e87afdd2325819e309070d4d0))
* handle posts with no default comments ([3f48474](https://github.com/ekrzeptowski/snoots-revived/commit/3f48474fedf2af582a87d026e0f8d8f1ef29637a)), closes [#67](https://github.com/ekrzeptowski/snoots-revived/issues/67)
* make empty listings actually empty ([f8467ca](https://github.com/ekrzeptowski/snoots-revived/commit/f8467ca2d8f1f12e80daf5ff0c30202eba44a48f))
* make form the default POST body ([8a80eac](https://github.com/ekrzeptowski/snoots-revived/commit/8a80eac9bc5cb8f7bbd1474352e5f3167dd3f679))
* make stubbed listings actually work ([a89c115](https://github.com/ekrzeptowski/snoots-revived/commit/a89c115acc7f6d0fee1a909f1297da2f221a9712))
* make SubredditControls::getSortedComments() work ([bf0518e](https://github.com/ekrzeptowski/snoots-revived/commit/bf0518e40c3abef2a25d37d2ee7b2b6bebb1ae5f))
* make tslib a runtime dependency ([239a415](https://github.com/ekrzeptowski/snoots-revived/commit/239a4152a87525b1b5a72e17e0fcc6cc4c075934))
* mark gid_x as optional ([35a38b2](https://github.com/ekrzeptowski/snoots-revived/commit/35a38b2443053068c7cfc7ad90409eea60c5e67e))
* mark the 'approved' boolean as optional ([0d71a50](https://github.com/ekrzeptowski/snoots-revived/commit/0d71a5012b33b0b71e0de16e60ef943664ebad65))
* populate Post.removed when missing ([#32](https://github.com/ekrzeptowski/snoots-revived/issues/32)) ([4c7ba39](https://github.com/ekrzeptowski/snoots-revived/commit/4c7ba394b4c84e942879d26421c405bff9640966))
* prevent race condition when updating rate limit data ([0d1b3b7](https://github.com/ekrzeptowski/snoots-revived/commit/0d1b3b7b3a59355f43e2a3e72dff32b78784352a))
* properly handle comment replies ([e754d3f](https://github.com/ekrzeptowski/snoots-revived/commit/e754d3fd26fbf9ad24ba3a1d3ee85f8950e0a819)), closes [#67](https://github.com/ekrzeptowski/snoots-revived/issues/67) [#71](https://github.com/ekrzeptowski/snoots-revived/issues/71)
* remove broken methods for now ([aedc8bc](https://github.com/ekrzeptowski/snoots-revived/commit/aedc8bcddd685a1972c12dbbbfe6c7a9c74848bf))
* remove reportReasons ([0fbcc02](https://github.com/ekrzeptowski/snoots-revived/commit/0fbcc028bc290518f5010362e156df57d4ba55f2))
* remove unused properties ([17a5f36](https://github.com/ekrzeptowski/snoots-revived/commit/17a5f3624ddde7ac0e88db585319154947492b97))
* request json api on all json posts ([5a8ff48](https://github.com/ekrzeptowski/snoots-revived/commit/5a8ff48712ff79474c5722121b82bf992d284bde))
* respect the time range when getting top posts ([cdba4cd](https://github.com/ekrzeptowski/snoots-revived/commit/cdba4cd384d2ce77b7095e66f92a17fbc4002708))
* store and use the given refresh token ([47be0af](https://github.com/ekrzeptowski/snoots-revived/commit/47be0af384f08769a620bad8b65476a41360165b))
* unbreak search()ed post comments yet again ([09876c6](https://github.com/ekrzeptowski/snoots-revived/commit/09876c67025677ee2072480571a798aa5165c7ac)), closes [#71](https://github.com/ekrzeptowski/snoots-revived/issues/71)
* update camelcase to 6.3.0 ([72ee276](https://github.com/ekrzeptowski/snoots-revived/commit/72ee276c793def28fd36e3710a5c31d8aad1af0a))
* update got to 11.8.3 ([2ba1587](https://github.com/ekrzeptowski/snoots-revived/commit/2ba15872c4470e2b91830d70c606296c0f785b1b))
* update tslib to 2.3.1 ([076e4ab](https://github.com/ekrzeptowski/snoots-revived/commit/076e4ab4e3245bfad6df3aedf4081a88496c2138))
* use the correct kind of Comment ([6e88c7e](https://github.com/ekrzeptowski/snoots-revived/commit/6e88c7efe6eb4cbc46ea0e7980c64a0dc6739530))


### Performance Improvements

* cache the lookahead for future use ([4a6b8cb](https://github.com/ekrzeptowski/snoots-revived/commit/4a6b8cbb5b6b0cf58e83a8efea214fa852ff22fe))
* fetch extra comments one page at a time ([d80b32a](https://github.com/ekrzeptowski/snoots-revived/commit/d80b32a1079a0d5fed18d19102168c7167099e5d))


### Code Refactoring

* add separate controls for MyUser ([57adf74](https://github.com/ekrzeptowski/snoots-revived/commit/57adf744909ec911d7a99d8c8d04df1f30189e7b))

## [1.0.0-dev.29](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.28...v1.0.0-dev.29) (2023-05-17)


### Bug Fixes

* respect the time range when getting top posts ([cdba4cd](https://github.com/thislooksfun/snoots/commit/cdba4cd384d2ce77b7095e66f92a17fbc4002708))

## [1.0.0-dev.28](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.27...v1.0.0-dev.28) (2023-04-02)


### Bug Fixes

* **deps:** update dependency tslib to ^2.5.0 ([7577950](https://github.com/thislooksfun/snoots/commit/757795040ae1ec6e63e91103ccb4e10f157deca0))

## [1.0.0-dev.27](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.26...v1.0.0-dev.27) (2022-12-27)


### Bug Fixes

* **deps:** update dependency got to ^11.8.6 ([82e6310](https://github.com/thislooksfun/snoots/commit/82e631023ec8ee77c80508058916a01a4038b968))

## [1.0.0-dev.26](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.25...v1.0.0-dev.26) (2022-12-04)


### Bug Fixes

* **deps:** update dependency tslib to ^2.4.1 ([afecdcf](https://github.com/thislooksfun/snoots/commit/afecdcffacd0899b015f607bfac865e7e262c5a4))

## [1.0.0-dev.25](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.24...v1.0.0-dev.25) (2022-12-04)


### Bug Fixes

* unbreak search()ed post comments yet again ([09876c6](https://github.com/thislooksfun/snoots/commit/09876c67025677ee2072480571a798aa5165c7ac)), closes [#71](https://github.com/thislooksfun/snoots/issues/71)

## [1.0.0-dev.24](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.23...v1.0.0-dev.24) (2022-11-12)


### Bug Fixes

* properly handle comment replies ([e754d3f](https://github.com/thislooksfun/snoots/commit/e754d3fd26fbf9ad24ba3a1d3ee85f8950e0a819)), closes [#67](https://github.com/thislooksfun/snoots/issues/67) [#71](https://github.com/thislooksfun/snoots/issues/71)

## [1.0.0-dev.23](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.22...v1.0.0-dev.23) (2022-10-14)


### Features

* make BaseControls::namespace() public ([f13d40b](https://github.com/thislooksfun/snoots/commit/f13d40bc41f2254480a607c65c48b1f98ee59ef0))


### Bug Fixes

* handle posts with no default comments ([3f48474](https://github.com/thislooksfun/snoots/commit/3f48474fedf2af582a87d026e0f8d8f1ef29637a)), closes [#67](https://github.com/thislooksfun/snoots/issues/67)

## [1.0.0-dev.22](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.21...v1.0.0-dev.22) (2022-05-02)


### ⚠ BREAKING CHANGES

* `Client.users.fetchMe()` is now `Client.me.fetch()`.

### Features

* add MyUserControls::getContributorSubreddits() ([48f41c0](https://github.com/thislooksfun/snoots/commit/48f41c02eb007aeb816d104bb41e182a3a9027f9))
* add MyUserControls::getModeratedSubreddits() ([291c74f](https://github.com/thislooksfun/snoots/commit/291c74f9d6d419d0f417dfbc0950eb4c1c802ac3))
* add MyUserControls::getSubscribedSubreddits() ([2ff0f50](https://github.com/thislooksfun/snoots/commit/2ff0f5006501884ef3ea43d4574c64e3ae620f1e))
* add SubredditControls::getDefault() ([1d170a4](https://github.com/thislooksfun/snoots/commit/1d170a4c9f25bf1f848b9fce1292cdd2fcaa60de))
* add SubredditControls::getNew() ([49be5ca](https://github.com/thislooksfun/snoots/commit/49be5cab5c4b5a86e938578f7b74d5048a5a0136))
* add SubredditControls::getPopular() ([cc91c08](https://github.com/thislooksfun/snoots/commit/cc91c081076d19518bbb4a729c952a179aebc8e7))
* add SubredditControls::getPremium() ([5a1274b](https://github.com/thislooksfun/snoots/commit/5a1274b4309a936db825dacfa8951343898f09c2))
* add UserControls::isUsernameAvailable() ([3a56e77](https://github.com/thislooksfun/snoots/commit/3a56e776534e23212f322d946ee487c88cf5abb3))


### Code Refactoring

* add separate controls for MyUser ([57adf74](https://github.com/thislooksfun/snoots/commit/57adf744909ec911d7a99d8c8d04df1f30189e7b))

## [1.0.0-dev.21](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.20...v1.0.0-dev.21) (2022-04-10)


### ⚠ BREAKING CHANGES

* `getRandomPost()` replaced with `getRandomPostId()`.

### Features

* add a way to get the last-known rate limit status for a client ([20f285f](https://github.com/thislooksfun/snoots/commit/20f285f812bf5412a4f60aca25dca843121246b6))
* add debug logging for rate limit status ([7ef9e83](https://github.com/thislooksfun/snoots/commit/7ef9e834915a2ea33dbe379bc136b24bfc367028))
* make calls to /random go entirely through OAuth ([87c9640](https://github.com/thislooksfun/snoots/commit/87c9640c422a03111f35c53af7fd94625cc269fa))
* replace getRandomPost() with getRandomPostId() ([8f56359](https://github.com/thislooksfun/snoots/commit/8f56359a4d5f950547e03be2ef8308b37d4e3cfe))


### Bug Fixes

* fix formatting of debug print ([3630026](https://github.com/thislooksfun/snoots/commit/363002623e1ec17e480d8d4fc4d0a5201a9bf8b0))
* prevent race condition when updating rate limit data ([0d1b3b7](https://github.com/thislooksfun/snoots/commit/0d1b3b7b3a59355f43e2a3e72dff32b78784352a))

## [1.0.0-dev.20](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.19...v1.0.0-dev.20) (2022-03-27)


### Features

* add a way to get banned users ([de2f41b](https://github.com/thislooksfun/snoots/commit/de2f41b338f454fd0a8310b94bc688d7d2c8686a))
* add a way to get muted users ([f4d9500](https://github.com/thislooksfun/snoots/commit/f4d9500defe46553d3c0910732c9e0e90f3cfcf5))
* add a way to get subreddit contributors ([b0f7cef](https://github.com/thislooksfun/snoots/commit/b0f7cefa54e4b077b693aa04431363bbebd34062)), closes [#49](https://github.com/thislooksfun/snoots/issues/49)
* add a way to get the list of moderators ([7cad99f](https://github.com/thislooksfun/snoots/commit/7cad99fc48de8c56ba72781087e5c7ca0600ea0a))
* add a way to get wiki contributors ([03ab9ef](https://github.com/thislooksfun/snoots/commit/03ab9efc77c491d96c1a62b220ab2ff464e3de85))
* add a way to get wikibanned users ([7e4e603](https://github.com/thislooksfun/snoots/commit/7e4e60315576e1634a17d9c8402b5fe689df11e2))

## [1.0.0-dev.19](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.18...v1.0.0-dev.19) (2022-03-27)


### ⚠ BREAKING CHANGES

* Removed the following methods from Subreddit and
SubredditControls pending finding a way to make them work:
- getContributors()
- getWikiContributors()
- getMutedUsers()
- getWikibannedUsers()
- getModerators()
- getBannedUsers()

### Bug Fixes

* make stubbed listings actually work ([a89c115](https://github.com/thislooksfun/snoots/commit/a89c115acc7f6d0fee1a909f1297da2f221a9712))
* make SubredditControls::getSortedComments() work ([bf0518e](https://github.com/thislooksfun/snoots/commit/bf0518e40c3abef2a25d37d2ee7b2b6bebb1ae5f))
* remove broken methods for now ([aedc8bc](https://github.com/thislooksfun/snoots/commit/aedc8bcddd685a1972c12dbbbfe6c7a9c74848bf))

## [1.0.0-dev.18](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.17...v1.0.0-dev.18) (2022-03-27)


### Features

* add a method to get the approved contributors in a subreddit ([c1edba2](https://github.com/thislooksfun/snoots/commit/c1edba2c48bcd1dc21be8e105bc96d91d1aef74f)), closes [#49](https://github.com/thislooksfun/snoots/issues/49)
* add a way to get the approved wiki contributors for a subreddit ([aaf06e7](https://github.com/thislooksfun/snoots/commit/aaf06e733681f6bf2353812c2d036e191d3db6ea))
* add a way to get the list of moderators in a subreddit ([8e1fea9](https://github.com/thislooksfun/snoots/commit/8e1fea9f4ca4291eb51eb6b69ccdec6dea29a255))
* add a way to get the users banned from a subreddit ([85831df](https://github.com/thislooksfun/snoots/commit/85831df2a8e8486f59741360c0f7a31227f5f9e9))
* add a way to manage wikibanned users in a subreddit ([8abe658](https://github.com/thislooksfun/snoots/commit/8abe658a863bd246f4e09d1a0b73d5acc3bb7c00))
* add controls to managing muted users in a subreddit ([d057dc0](https://github.com/thislooksfun/snoots/commit/d057dc0ad1b74981eea384a7d717874d141273e3))

## [1.0.0-dev.17](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.16...v1.0.0-dev.17) (2022-03-05)


### ⚠ BREAKING CHANGES

* Renamed type `Capcha` -> `Captcha` (fixed typo).

### Features

* add Client.getAuthorizedScopes() ([1cdcac2](https://github.com/thislooksfun/snoots/commit/1cdcac2e2b7c3f9fb1d9685f8935ac3c304483f6)), closes [#43](https://github.com/thislooksfun/snoots/issues/43)
* allow getting and setting a post's suggested sort ([b6235b8](https://github.com/thislooksfun/snoots/commit/b6235b83fccb0fa547f9ae8ef8e775acca7a7f3e))
* allow locking and unlocking comments ([766726b](https://github.com/thislooksfun/snoots/commit/766726bb99b9fc0c23de235411e336440252977a))


### Bug Fixes

* fix typo (Capcha -> Captcha) ([774866d](https://github.com/thislooksfun/snoots/commit/774866d5392958dbdb7cd833ad76d0ae37182b5c))

## [1.0.0-dev.16](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.15...v1.0.0-dev.16) (2022-02-12)


### Features

* add optional debugging via the `debug` module ([fbb7bb3](https://github.com/thislooksfun/snoots/commit/fbb7bb31086d72c87c2c967a2bf58e3b8058ab81))

## [1.0.0-dev.15](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.14...v1.0.0-dev.15) (2022-02-04)


### ⚠ BREAKING CHANGES

* `Post.thumbnailHeight` and `Post.thumbnailWidth` have
been temporarily removed. They were not yet supposed to be exposed, but
they slipped through the cracks.
* There is no longer a default export. If you are using
TypeScript or ESM switch from using `import Client from "snoots"` to
using `import { Client } from "snoots"`. If you are using CommonJS
switch from `const Client = require("snoots")` to
`const { Client } = require("snoots")`, or to
`const Client = require("snoots").Client`.
* All internal usages of `null` have been replaced with
`undefined`. This includes mapping `null` to `undefined` in Reddit's API
responses. If you were checking any values for existence with `=== null`
you should replace that check with `=== undefined` (or `== null` or
`== undefined`).
* `Client.authFromCode()` has been replaced with
`Client.fromAuthCode()`.
* `Client.getAuthUrl()` has been renamed to
`Client.makeAuthUrl()`.

### Features

* **docs:** update typedoc to 0.22 ([a8260d7](https://github.com/thislooksfun/snoots/commit/a8260d7af94a20fad608beb3317d9f4999f178a6))
* move all Reddit REST api interaction into new Gateway classes ([8c0856a](https://github.com/thislooksfun/snoots/commit/8c0856a1d1098e8d49794fecdee1f300d6ed3ff4))
* remove default export ([3df8d41](https://github.com/thislooksfun/snoots/commit/3df8d41a26b3f5d8f0bb59e55d9bcb44d86a3f35))
* rename Client.getAuthUrl() -> Client.makeAuthUrl() ([ba87fdf](https://github.com/thislooksfun/snoots/commit/ba87fdfe1b5d9d300f140c1bb2a785b79e4565f8))
* replace `null` with `undefined` ([5ab17b6](https://github.com/thislooksfun/snoots/commit/5ab17b61bb1051e7d6205eccbfc8facf10cc3121))
* replace Client.authFromCode() with Client.fromAuthCode() ([8fa90b8](https://github.com/thislooksfun/snoots/commit/8fa90b810461dd739b10d51dcdad947424a571af))


### Bug Fixes

* export Replyable ([8fc0ddf](https://github.com/thislooksfun/snoots/commit/8fc0ddf3e028c082f3ace118ff412e41614e4b09))
* remove unused properties ([17a5f36](https://github.com/thislooksfun/snoots/commit/17a5f3624ddde7ac0e88db585319154947492b97))
* update camelcase to 6.3.0 ([72ee276](https://github.com/thislooksfun/snoots/commit/72ee276c793def28fd36e3710a5c31d8aad1af0a))
* update got to 11.8.3 ([2ba1587](https://github.com/thislooksfun/snoots/commit/2ba15872c4470e2b91830d70c606296c0f785b1b))
* update tslib to 2.3.1 ([076e4ab](https://github.com/thislooksfun/snoots/commit/076e4ab4e3245bfad6df3aedf4081a88496c2138))

## [1.0.0-dev.14](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.13...v1.0.0-dev.14) (2021-05-29)


### Bug Fixes

* populate Post.removed when missing ([#32](https://github.com/thislooksfun/snoots/issues/32)) ([4c7ba39](https://github.com/thislooksfun/snoots/commit/4c7ba394b4c84e942879d26421c405bff9640966))

## [1.0.0-dev.13](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.12...v1.0.0-dev.13) (2021-05-14)


### Bug Fixes

* make empty listings actually empty ([f8467ca](https://github.com/thislooksfun/snoots/commit/f8467ca2d8f1f12e80daf5ff0c30202eba44a48f))

## [1.0.0-dev.12](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.11...v1.0.0-dev.12) (2021-05-14)


### Features

* add a helper to get the first item from a Listing ([61e8e35](https://github.com/thislooksfun/snoots/commit/61e8e35b99a05a590101262ba276b704afa5b915))


### Bug Fixes

* add a default sort to User(Controls).getPosts() ([7a20a03](https://github.com/thislooksfun/snoots/commit/7a20a03194756955562f05e3fd5e7eeff63ad39f))

## [1.0.0-dev.11](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.10...v1.0.0-dev.11) (2021-05-14)


### Features

* add initial support for interacting with users ([bd0fc8b](https://github.com/thislooksfun/snoots/commit/bd0fc8b01140aaab1b0b47eb6cdedb96a79c2b22))

## [1.0.0-dev.10](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.9...v1.0.0-dev.10) (2021-04-14)


### Performance Improvements

* fetch extra comments one page at a time ([d80b32a](https://github.com/thislooksfun/snoots/commit/d80b32a1079a0d5fed18d19102168c7167099e5d))

## [1.0.0-dev.9](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.8...v1.0.0-dev.9) (2021-04-13)


### ⚠ BREAKING CHANGES

* This renames Listing.each to Listing.forEach, and
it is now no longer the preferred method of iteration. Instead you
should probably use `for await` loops.

### Features

* make Listings iterable ([868d58d](https://github.com/thislooksfun/snoots/commit/868d58d06d5a38dd94e7d293d722d89f649e8b53))

## [1.0.0-dev.8](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.7...v1.0.0-dev.8) (2021-04-13)


### Bug Fixes

* use the correct kind of Comment ([6e88c7e](https://github.com/thislooksfun/snoots/commit/6e88c7efe6eb4cbc46ea0e7980c64a0dc6739530))

## [1.0.0-dev.7](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.6...v1.0.0-dev.7) (2021-04-12)


### Bug Fixes

* make tslib a runtime dependency ([239a415](https://github.com/thislooksfun/snoots/commit/239a4152a87525b1b5a72e17e0fcc6cc4c075934))

## [1.0.0-dev.6](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.5...v1.0.0-dev.6) (2021-04-12)


### Features

* add getters for moderation listings ([1c3876e](https://github.com/thislooksfun/snoots/commit/1c3876e56cc5b8816354392f8e7bbdf601ee272f))


### Bug Fixes

* export Subreddit ([1f6041d](https://github.com/thislooksfun/snoots/commit/1f6041da5bf1f36c68a14bc4419740d767ef2619))

## [1.0.0-dev.5](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.4...v1.0.0-dev.5) (2021-04-09)


### Features

* add a method to (re)authorize a client ([d86550d](https://github.com/thislooksfun/snoots/commit/d86550d0e7aef8cfbdaa8333d45207119cf9c2e5))
* add a way to get the refresh token ([e55b9e2](https://github.com/thislooksfun/snoots/commit/e55b9e2088b780d7b05fb5ac1360a7616b980741))
* add OAuth flow ([7029a16](https://github.com/thislooksfun/snoots/commit/7029a16f3c0cf1af2face6baf8b9c0e1423606c5))

## [1.0.0-dev.4](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.3...v1.0.0-dev.4) (2021-04-08)


### Features

* add a helper function for crossposting ([19b7fc5](https://github.com/thislooksfun/snoots/commit/19b7fc57a76fb38047bd1f749560476d88a47f99))
* add a way to search posts ([00c48ec](https://github.com/thislooksfun/snoots/commit/00c48ec7747f555dbc00065f5854e0cbf5dc82e3))
* add blockAuthor() ([58feff1](https://github.com/thislooksfun/snoots/commit/58feff1f1ab3962a009c44efae8334805c9c4ccf))
* add initial support for Subreddits ([b5f09ea](https://github.com/thislooksfun/snoots/commit/b5f09eafa1b1a3840a6d6b6864b82528a9c1893e))

## [1.0.0-dev.3](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.2...v1.0.0-dev.3) (2021-03-26)


### Features

* add a function to approve an item ([11cde28](https://github.com/thislooksfun/snoots/commit/11cde2862bd4c7dd27f80ba18776ceae9e86e159))
* add a helper to check if any items match ([3f9403d](https://github.com/thislooksfun/snoots/commit/3f9403d3ad50b426bb8d817a3803ec9fa5072fb7))
* add a way to execute a function on each page of a listing ([313c4af](https://github.com/thislooksfun/snoots/commit/313c4af73b1a1147dc0393afbc63d310d7f8b377))
* add a way to reply to content ([f5cbf7e](https://github.com/thislooksfun/snoots/commit/f5cbf7e79fa9d929f6ca72082bf4c2e51c126cd9))
* add partial support for Posts ([808df45](https://github.com/thislooksfun/snoots/commit/808df45279f6c5e3c5201a06c933c885b891c09e))


### Bug Fixes

* batch comments 75 at a time ([d3cad93](https://github.com/thislooksfun/snoots/commit/d3cad93f1b7fa0bf66dc46ebfc07d81ac6f7ad08))
* mark the 'approved' boolean as optional ([0d71a50](https://github.com/thislooksfun/snoots/commit/0d71a5012b33b0b71e0de16e60ef943664ebad65))

## [1.0.0-dev.2](https://github.com/thislooksfun/snoots/compare/v1.0.0-dev.1...v1.0.0-dev.2) (2021-03-14)


### Bug Fixes

* store and use the given refresh token ([47be0af](https://github.com/thislooksfun/snoots/commit/47be0af384f08769a620bad8b65476a41360165b))

## 1.0.0-dev.1 (2021-03-14)


### Features

* the initial (dev) release!
