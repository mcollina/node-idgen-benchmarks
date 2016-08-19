'use strict'

const benchmark = require('benchmark')
const Hashids = require('hashids')
const shortid = require('shortid')
const nid = require('nid')
const uuid = require('uuid')
const farmhash = require('farmhash')
const highwayhash = require('highwayhash')

const suite = new benchmark.Suite()

const hashids = new Hashids('mybench');

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const seed = uuid.v4()
var myhashCount = 0
var boomCount = 0

const seedArray = uuid.parse(uuid.v4())
var boomSeed = new Buffer(seedArray).toString('base64')

//for (var i = 0; i < seedArray.length; i++) {
//  boomSeed += alphabet[(alphabet.length -1) & seedArray[i]]
//}

Number(boomSeed)

function boomHash () {
  return boomSeed + '/' + (boomCount++)
}

function myhash () {
  var result = farmhash.hash32(seed + (myhashCount++))
  var l = ''
  var step = 4
  for (var i = 1; i < 32; i += step) {
    l += alphabet[(result & 0xffff) % alphabet.length]
    result = result >> step
  }
  return l
}

const key = new Buffer(uuid.parse(uuid.v4()).concat(uuid.parse(uuid.v4())))
console.log(key.length)
var orig = '42'
function myhigh () {
  orig = highwayhash.asHexString(key, new Buffer(orig))
  return orig
}

console.log('hashids', hashids.encode(process.hrtime()))
console.log('shortid', shortid())
console.log('nid', nid())
console.log('myhash', myhash())
console.log('myhigh', myhigh())
console.log('boomHash', boomHash())

suite.add('hashids process.hrtime', function () {
  hashids.encode(process.hrtime())
})

let hashIdCounter = 0

suite.add('hashids counter', function () {
  hashids.encode(hashIdCounter++)
})

suite.add('shortid', function () {
  shortid()
})

suite.add('nid', function () {
  nid()
})

suite.add('uuid.v4', function () {
  uuid.v4()
})

suite.add('uuid.v1', function () {
  uuid.v4()
})

suite.add('farmhash', function () {
  farmhash.hash32(seed + (myhashCount++))
})

suite.add('myhash', function () {
  myhash()
})

suite.add('myhigh', function () {
  myhigh()
})

var a = 0
suite.add('buum', function () {
  seed + '/' + (a++)
})

suite.on('cycle', cycle)

suite.run()

function cycle (e) {
  console.log(e.target.toString())
}
