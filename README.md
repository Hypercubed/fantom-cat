# fantom-cat

FANTOM CAT (CAGE Associated Transcriptome) is a human transcriptome meta-assembly based on association of CAGE (Cap Analysis of Gene Expression) data and transcript models from diverse sources. In FANTOM CAT, gene models are robustly supported by transcription initiation evidences and represents the most 5’completed human transcriptome to date. These genes are comprehensively annotated into categories based on their genomic and epigenomic features, including 23,887 high-confidence long non-coding RNA (lncRNA) genes.

# Deploying fantom-cat

## Building from source

fantom-cat was developed using the [Project χ toolkit](https://github.com/Hypercubed/Project-chi).  If you are not familiar with Project-χ please see [here](https://github.com/Hypercubed/Project-chi#readme).  To utilize Project χ You should be familiar with [JSPM](http://jspm.io/), [SystemJS](https://github.com/systemjs/systemjs), and [Gulp](http://gulpjs.com/).

```sh
git clone https://github.com/Hypercubed/Project-Chi.git
cd Project-Chi
git checkout tags/v1.0.0-rc.17  # ensure you are using the same version of Project χ
npm install # jspm install is run post-install by npm
git clone https://github.com/Hypercubed/fantom-cat.git dataset/fantom-cat
```

Now add data to the `./dataset/fantom-cat/app/data` directory.

Start the development server:

```sh
gulp dev --dataset=./dataset/fantom-cat/ --bundle --open
# http://localhost:9000 will be opened in your default browser
```

# About Project χ

This website was built using the [Project χ platform](https://github.com/Hypercubed/Project-chi). Project χ (pronounced project kai or /<abbr title="/ˈ/ primary stress follows">ˈ</abbr><abbr title="'k' in 'kind'">k</abbr><abbr title="/iː/ long 'e' in 'bead'">iː</abbr>/) is a modular open-source toolkit for building web and electron data visualization applications built by Jayson Harshbarger at the [RIKEN Institute in Yokohama Japan](http://www.yokohama.riken.jp/english/).  It offers a template and toolset for building self-hosted data-centric visualization websites. Geared towards sharing of supplemental materials associated with scientific publications; Project χ allows visitors to interact with visualizations, download associated data and images, and even try the visualization with their own uploaded or publicly available datasets.  For developers the framework comes packaged with tools necessary for quickly integrating interactive visualizations using [d3.js](http://d3js.org/), [AngularJS](https://angularjs.org/), and [BioJS](http://biojs.io/). More information can be found [here](https://github.com/Hypercubed/Project-chi#readme).

# Contact

For more information please contact [J. Harshbarger](mailto:jayson.harshbarger@riken.jp)

## How to cite

TBD

## Acknowledgments
This work was supported by a research grant from the Japanese Ministry of Education, Culture, Sports, Science and Technology (MEXT) to the RIKEN Center for Life Science Technologies.

## Source Code License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

Copyright (c) 2016 RIKEN, Japan.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
