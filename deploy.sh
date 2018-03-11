#!/bin/bash

# Install awscli "sudo apt install awscli"
# Configure "aws configure"

FTVersion="$(git log FinTechToken/master --pretty=%h --max-count=1)"
cp indexAOT.html index.html
sed -i "s/FTVersion/$FTVersion/g" index.html

aws s3 sync dist s3://www.fintechtoken.com/dist
aws s3 sync js s3://www.fintechtoken.com/js
aws s3 sync css s3://www.fintechtoken.com/css
aws s3 sync fonts s3://www.fintechtoken.com/fonts
aws s3 sync img s3://www.fintechtoken.com/img
aws s3 sync ./ s3://www.fintechtoken.com --exclude "*" --include "index.html"

aws cloudfront create-invalidation --distribution-id E3AR3OWYF67PT4 --paths /index.html /img/* /js/* /dist/* /fonts/* /css/*
