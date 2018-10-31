#!/usr/bin/env node
const express = require('express')
const app = express()
const Luna = require('./lib/core')
const open = require('open')
const ln = new Luna('src')
const path = require('path')
const _envPath = __dirname

//全局变量缓存数据
let result = {}
app.use(express.static(path.join(_envPath, 'dist')))
app.get('/getData', (req, res) => {
  if(result.pages) {
    res.send(result)
  } else {
    ln.getTree().then(rs => {
      res.send(rs)
      result= rs;
    })
  }
})

app.listen(8081, () => {
  open('http://localhost:8081/')
})