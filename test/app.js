'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')

mongoose.set('debug', true)
mongoose.connect('mongodb://localhost/rest')

const Schema = mongoose.Schema

const studentSchema = new Schema({
  name: String,
  sex: String,
  school: {
    type: Schema.Types.ObjectId,
    ref: 'school'
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'parent'
  }
})

const schoolSchema = new Schema({
  name: String,
  address: String
})

const parentSchema = new Schema({
  name: String,
  phone: String
})

mongoose.model('student',studentSchema)
mongoose.model('school',schoolSchema)
mongoose.model('parent',parentSchema)

mongoose.connection
  .on('error', err => {
    console.error('MongoDB-Error', err)
  })
  .on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })
  .on('open', async () => {
    console.info('mongoose start')
    // const Student = mongoose.model('student')
    // const School = mongoose.model('school')
    // const Parent = mongoose.model('parent')

    // const student_count = await Student.collection.countDocuments()

    // console.log('student_count', student_count)

    // const dataParent = [
    //   {
    //     name: '小王他爹',
    //     phone: '13888000444'
    //   },
    //   {
    //     name: '小张他妈',
    //     phone: '15508722982'
    //   }
    // ]

    // Parent.insertMany(dataParent)

    // const dataSchool = [
    //   {
    //     name: '武城小学',
    //     address: '昆明市五华区武城路'
    //   },
    //   {
    //     name: '红旗小学',
    //     address: '昆明市人民路'
    //   }
    // ]

    // await School.insertMany(dataSchool)

    // const one = await School.findOne({}).exec()
    // console.log(one)

    // const dataStudent = [
    //   {
    //     name: '小张',
    //     sex: '男',
    //     school: one._id
    //   },
    //   {
    //     name: '小王',
    //     sex: '男',
    //     school: one._id
    //   },
    //   {
    //     name: '小张',
    //     sex: '男',
    //     school: one._id
    //   },
    // ]

    // await Student.insertMany(dataStudent)
  })

const app = new Koa();

app.use(bodyParser())

let router = new Router()

const tab = function (tab) {
  let model;
  try {
      model = mongoose.model(tab);
  } catch (error) {
      model = mongoose.model(tab, new Schema({}, { strict: false }));
  }
  return model;
}

router.get('/', ctx=> {
  ctx.body = 'index'
})

router.get('/api/:model', async (ctx, next) => {
  const Model = tab(ctx.params.model)
  const res = await Model.find({}).populate(['school', 'parent'])

  ctx.body = {
    success: true,
    data: res
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(8088)



// var Koa = require('koa');
// var Router = require('koa-router');

// var app = new Koa();
// var router = new Router();

// router.get('/', (ctx, next) => {
//   ctx.body = {
//     success: true,
//     data: [1,2,3,4,5]
//   }
// });

// app
//   .use(router.routes())
//   .use(router.allowedMethods());

// app.listen(8088)