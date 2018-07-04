'use strict'

// const rest = require('./rest')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const router = new Router()

router.route('/:model')
  .get()

module.exports = app => {
  app.use(bodyParser)
  app.use(router)
}
