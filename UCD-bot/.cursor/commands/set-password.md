# set-password

Write your command content here.

This command will be available in chat with /set-password

From: https://prototype-kit.service.gov.uk/docs/publishing

Setting a password
When running the Prototype Kit online, you need to set a password. This is to stop anyone finding your prototype accidentally and mistaking it for a real service.

Check your hosting services documentation on how to set 'environment variables' (it may have a slightly different name like 'config vars' or 'variables').

To set a password, you need to add 2 environment variables where the:

name is NODE_ENV, and the value is production
name is PASSWORD, and the value is whatever password you want to use

