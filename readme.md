DroidScriptPasswordGenerator
============================

Synopsis
--------

My exploration of [XKCD's Password Generator][1] via [DroidScript][2].

So, this is pretty much what I was after all the long. I wanted to be able to
generate passwords based on XKCD's ideas, but I wanted to do it all locally on
my phone, and I wanted to be able to supply my own dictionary.

For reasons unknown to me, I have had no luck with creating GUIs that work on
Android using Real Programming Languages. It's probably because I'm a dinosaur
PC programmer, where "dinosaur" modifies "programmer".

DroidScript provides a decently simple abstraction to create GUIs on Android.
Unfortunately, it uses JavaScript. Joy.

Running the Generator
---------------------

Install [DroidScript][3] on an Android device.

Put this repository into the DroidScript folder on the Android device. This
should result in a PasswordGenerator project available from within DroidScript.

Run DroidScript on the Android device.

Tap the PasswordGenerator icon.

There's a menu drawer that slides out from the left of the screen. Load preset
configurations, make adjustments per your liking, then tap Generate Passwords.

This is a working product, but it is not yet bullet-proof.

[Caveat Lector][4]
------------------

The reader of delicate sensibilities should stick with the dictionary word
listing `EN_sample.txt` or `EN_2084.txt` and avoid `EN_curse.txt`. The cursed
passwords generated using the dictionary curse word listing just make me laugh.

[1]: https://xkpasswd.net/s/
[2]: http://droidscript.org/
[3]: https://play.google.com/store/apps/details?id=com.smartphoneremote.androidscriptfree
[4]: https://www.merriam-webster.com/dictionary/caveat%20lector
