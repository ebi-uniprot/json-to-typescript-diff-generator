# About

This script is used to view the differences in endpoint model changes by:

1. Converting example JSON --> Typescript schema for each of current and next endpoints
2. Generating a text diff
3. Creating and opening an HTML of the diff

# Usage

```
yarn model-diff <current-json-endpoint-url> <next-json-endpoint-url> <html-out>
```

for example:

```
yarn model-diff \
https://wwwdev.ebi.ac.uk/uniprot/api/uniprotkb/accession/O43865/publications\?\&size\=100 \
http://wp-np2-be:8090/uniprot/api/uniprotkb/accession/O43865/publications\?\&size\=100 \
~/diff.html
```
