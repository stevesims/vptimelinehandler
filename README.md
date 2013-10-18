# VPTimelineHandler
by [Vert Pixels Ltd.](http://vertpixels.com)

## Description

VPTimelineHandler is a simple timeline handling module.

## Usage

VPTimelineHandler provides a simple light-weight object prototype for running a timeline.

## Notes

VPTimelineHandler does not, itself, include any code for discovering what the time is. This was an intentional design choice, so as to allow for a timeline driven not only on absolute time, but also to allow for timed events to be synchronised with media playback. Code that makes use of a VPTimelineHandler object to drive a timeline will need to periodically call the handler's checkTime method, passing in a time value (in seconds).

Basic documentation will be added soon, as will some basic code examples.

## Real-life Examples

VPTimelineHandler started out as part of the technology that drove the music visualizer in the [Deadmau5 iTunes LP 4x4=12](https://itunes.apple.com/us/album/4x4-12-deluxe-version/id406919167).

It's latest public outing has been in the [Tinie Tempah Demonstration album promo site](http://listen.tinietempah.com/), which also makes use of our application framework [VPBooklet](https://github.com/stevesims/vpbooklet) and animation engine [VPAnimEngine](https://github.com/stevesims/vpanimengine). It was used there to control timed lyrics animations, as well as triggering some other timed animations.

## Compatibility

VPTimelineHandler should be broadly compatible with most browser environments.

The only potential compatibility problem for older browsers is it makes use of JavaScript's Array.isArray(), and array instance forEach method, which may not be available in all JavaScript environments. Many compatibility shims and polyfills however are available.

## License

VPAnimEngine is licensed under the [BSD License](http://opensource.org/licenses/BSD-2-Clause)

## Credits

VPAnimEngine was designed and built by Steve Sims and John-Paul Harold of Vert Pixels Ltd.
