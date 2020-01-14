What is this?
=============

You will find a collection of scripts and configurations to make the web more friendly. They will mostly remove trackers, refuse consent to personnal data usage, and make popin or ads disappear.

Rules
=====

For [uBlock Origin](https://github.com/gorhill/uBlock)
------------------------------------------------------

This list will add filters for french and tech websites, removing ads, trackers, promotional sections and annoying popins. I may add agressive filters (like removing a newsletter subscription popin). It should not break the website itself but may hide some marketing features.

I do not test the compatibility with other tools than ublock-origin. See https://github.com/gorhill/uBlock/wiki/Static-filter-syntax

Filers: ublock-origin/edas--web-sanitization.txt


[Consent-O-Matic](https://github.com/cavi-au/Consent-O-Matic)
-------------------------------------------------------------

Most generic rules will be shared to the upstream project (and removed from there once it's done). You will find here rules specific to French websites and removal of information popins.

Rules: consent-o-matic/edas--web-sanitization.txt 


Contributions
=============

Contributions are more than welcomed. Please simply add a brand new file inside the wanted `rules.d` or `filters.d` and propose a PR. It will be easiest to test and manage. Also, JSON indivual files will be parsed as JSONC (JSON with block `/*  */` and single lines `// ` comments) even if these comments may be stripped in the merge process.

You're also welcome to ask for help if you want to contribute but don't manage to do it alone. Just fill an issue with as much information you can.

By contributing code, documentation or any other content to this project, you hereby agree to make this code, documentation and content available under the terms of the [CC0 1.0 Universal licence](https://creativecommons.org/publicdomain/zero/1.0/legalcode). You also assert you have the legal right over the code, documentation and content to contribute under the above terms.

Such requirement is needed in order to be able to change the license or add specific exceptions in the future.


License
=======

Unless stated otherwise, all the content from this repository is licensed under the terms of the [AGPL version 3 or later](https://www.gnu.org/licenses/agpl.txt). A copy of the version 3 is available in the file named LICENSE at the root of the project.

If you think you should be using all or part of this project but can't comply with this license, please fill an issue and we'll find out what is possible.

Contributions are required to be sent under other terms. Please see the "Contributions" section for more details.
