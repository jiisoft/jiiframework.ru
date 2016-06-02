# How to add changes

Suppose you have found a bug or you want to add new feature to Jii functionality in any repository. Then your workflow will be`

1. Fork `jii-...` repository, where you want to do changes.
2. Create folders on your local machine with structure `jii/node_modules/jii-...`, in order to place modules inside `node_modules` folder
3. Clone your fork `git clone git@github.com:<username>/<jii-...>.git`
4. Go to repository folder `cd jii-....`
5. Run `npm install` to install dependencies
6. At this point we have configured workspace to make experiments with Jii Framework. Make nedeed changes.
7. Commit changes `git commit -m "..."`
8. Push them on github repository `gut push`
9. Open [Pull Request](https://help.github.com/articles/using-pull-requests/) to source branch

## Module tests

Run tests before pushing your changes. Use commands below to run all modules' tests from repository

```sh
node node_modules/nodeunit/bin/nodeunit tests/unit/
```

Run single module test:

```sh
node node_modules/nodeunit/bin/nodeunit tests/unit/ActiveRecordTest.js
```
