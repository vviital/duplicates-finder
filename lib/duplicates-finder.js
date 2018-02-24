'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateFinder = undefined;

var _asyncGenerator = function () { function AwaitValue(value) { this.value = value; } function AsyncGenerator(gen) { var front, back; function send(key, arg) { return new _bluebird2.default(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; if (value instanceof AwaitValue) { _bluebird2.default.resolve(value.value).then(function (arg) { resume("next", arg); }, function (arg) { resume("throw", arg); }); } else { settle(result.done ? "return" : "normal", result.value); } } catch (err) { settle("throw", err); } } function settle(type, value) { switch (type) { case "return": front.resolve({ value: value, done: true }); break; case "throw": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== "function") { this.return = undefined; } } if (typeof Symbol === "function" && Symbol.asyncIterator) { AsyncGenerator.prototype[Symbol.asyncIterator] = function () { return this; }; } AsyncGenerator.prototype.next = function (arg) { return this._invoke("next", arg); }; AsyncGenerator.prototype.throw = function (arg) { return this._invoke("throw", arg); }; AsyncGenerator.prototype.return = function (arg) { return this._invoke("return", arg); }; return { wrap: function (fn) { return function () { return new AsyncGenerator(fn.apply(this, arguments)); }; }, await: function (value) { return new AwaitValue(value); } }; }();

let readFullFilenames = (() => {
  var _ref = _asyncGenerator.wrap(function* (filepath) {
    const files = yield _asyncGenerator.await(_bluebird2.default.promisify(_fs2.default.readdir, { context: _fs2.default })(filepath));

    for (const filename of files) {
      yield _path2.default.join(filepath, filename);
    }
  });

  return function readFullFilenames(_x) {
    return _ref.apply(this, arguments);
  };
})();

let getStatistic = (() => {
  var _ref2 = _asyncGenerator.wrap(function* (files) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _asyncIterator(files), _step, _value; _step = yield _asyncGenerator.await(_iterator.next()), _iteratorNormalCompletion = _step.done, _value = yield _asyncGenerator.await(_step.value), !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
        const filename = _value;

        const stat = yield _asyncGenerator.await(_bluebird2.default.promisify(_fs2.default.stat, { context: _fs2.default })(filename));
        stat.fullpath = filename;

        yield stat;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          yield _asyncGenerator.await(_iterator.return());
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });

  return function getStatistic(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncGeneratorDelegate(inner, awaitWrap) { var iter = {}, waiting = false; function pump(key, value) { waiting = true; value = new _bluebird2.default(function (resolve) { resolve(inner[key](value)); }); return { done: false, value: awaitWrap(value) }; } ; if (typeof Symbol === "function" && Symbol.iterator) { iter[Symbol.iterator] = function () { return this; }; } iter.next = function (value) { if (waiting) { waiting = false; return value; } return pump("next", value); }; if (typeof inner.throw === "function") { iter.throw = function (value) { if (waiting) { waiting = false; throw value; } return pump("throw", value); }; } if (typeof inner.return === "function") { iter.return = function (value) { return pump("return", value); }; } return iter; }

function _asyncIterator(iterable) { if (typeof Symbol === "function") { if (Symbol.asyncIterator) { var method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { return iterable[Symbol.iterator](); } } throw new TypeError("Object is not async iterable"); }

const duplicateFinder = basePath => {
  let walk = (() => {
    var _ref3 = _asyncGenerator.wrap(function* (filepath) {
      const filesIterator = readFullFilenames(filepath);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _asyncIterator(getStatistic(filesIterator)), _step2, _value2; _step2 = yield _asyncGenerator.await(_iterator2.next()), _iteratorNormalCompletion2 = _step2.done, _value2 = yield _asyncGenerator.await(_step2.value), !_iteratorNormalCompletion2; _iteratorNormalCompletion2 = true) {
          const fileStats = _value2;

          if (fileStats.isDirectory()) {
            const { fullpath } = fileStats;
            yield* _asyncGeneratorDelegate(_asyncIterator(walk(fullpath)), _asyncGenerator.await);
            continue;
          }
          // To produce the same strings to compare
          const key = JSON.stringify({ size: fileStats.size, filename: _path2.default.basename(fileStats.fullpath) });
          const cnt = memory.get(key) || 0;

          memory.set(key, cnt + 1);
          yield fileStats;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            yield _asyncGenerator.await(_iterator2.return());
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    });

    return function walk(_x3) {
      return _ref3.apply(this, arguments);
    };
  })();

  const memory = new Map();

  // memory[Symbol.iterator] = function() {
  //   let entries = null;
  //   let i = 0;

  //   const sortedArray = [...this.entries()].sort((a, b) => b[1] - a[1]);

  //   return ({
  //     // Show with and without this line and explain difference
  //     [Symbol.iterator]() { return this; },

  //     next() {
  //       if (i === sortedArray.length) return { done: true, value: undefined };
  //       return { done: false, value: sortedArray[i++] };
  //     },
  //   });
  // };

  memory[Symbol.iterator] = function* () {
    let sortedEntries = [...this.entries()].sort((a, b) => b[1] - a[1]); // https://stackoverflow.com/a/48324540

    yield* sortedEntries;
  };

  return (() => {
    var _ref4 = _asyncGenerator.wrap(function* () {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _asyncIterator(walk(basePath)), _step3, _value3; _step3 = yield _asyncGenerator.await(_iterator3.next()), _iteratorNormalCompletion3 = _step3.done, _value3 = yield _asyncGenerator.await(_step3.value), !_iteratorNormalCompletion3; _iteratorNormalCompletion3 = true) {
          const fileStats = _value3;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            yield _asyncGenerator.await(_iterator3.return());
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      for (const value of memory) yield value;
    });

    function walkWrapper() {
      return _ref4.apply(this, arguments);
    }

    return walkWrapper;
  })();;
};

exports.duplicateFinder = duplicateFinder;