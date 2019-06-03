# Influx
An AWS Lambda based Microsub server. 

## Brainstorming
The goal is to have an approach like gmail, where everything that comes in really just goes into one big "bucket". Each post that comes in from a feed is fetched and created into a single "Post" object, that rather than remaining "within" the feed instead is just linked to the feed that it is imported from. This means there is only ever one instance of a post in the server, posts are de-dupped and connected to multiple feeds potentially.

By default, there is a "Global" feed that all new subscriptions are added to. The goal, is rather than adding feeds to different channels, you subscribe to a feed and then you can create rules that send posts that come in into various channels.

### Features
#### Inbox
* Kind of like Gmail, every post by default gets put into the inbox when it first enters the system. Even when a post is deleted from the system, the goal is to keep the UID/URL of the individual post in the system archived *somewhere* so that if it ever enters the system again, we can compare the UID/URL and discover that it once was in the system and was deleted. Not sure of the correct behavior (remain deleted or enter archive).

#### Rules
* Like Gmail, the key will be everything really ends up in the inbox, unless you employ rules. Rules could be such things as if a post has a specific property (photo, video, checkin, etc) or matches a specific post type (using PTD), then:
** Mark as read
** Auto delete
** Mute until X day/time (after mute duration, posts that were muted will automatically appear back in the inbox or any other channels
** Skip Inbox and Move to Channel
** Remaing in Inbox and Add to Channel

### Use Cases
* On the day of an event or just before the day of an event, I could add a global rule that moves any posts that mention specific keywords like "WWDC", "Apple", "iOS", "iPad", "iPhone", "Mac", etc to a new channel. This could be a copy (if you allow it to remain in Inbox) or you can have it "Skip" the Inbox and only show up in that other channel.



## Research
### Newsblur Intelligence Training
* https://newsblur.com/faq
* https://blog.newsblur.com/post/45632737156/three-months-to-scale-newsblur
* https://blog.newsblur.com/post/4262089560/explaining-intelligence
* https://blog.newsblur.com/post/168431864825/intelligence-training-comes-to-newsblurs-android
