function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import 'regenerator-runtime/runtime';
import './onboard-2004c9f5.js';
import 'bignumber.js';
import 'bnc-sdk';
import 'bowser';

function network() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stateAndHelpers) {
      var network, appNetworkId, walletSelect, exit, stateSyncStatus, stateStore;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              network = stateAndHelpers.network, appNetworkId = stateAndHelpers.appNetworkId, walletSelect = stateAndHelpers.walletSelect, exit = stateAndHelpers.exit, stateSyncStatus = stateAndHelpers.stateSyncStatus, stateStore = stateAndHelpers.stateStore;

              if (!(network === null)) {
                _context.next = 5;
                break;
              }

              if (!stateSyncStatus.network) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return new Promise(function (resolve) {
                stateSyncStatus.network && stateSyncStatus.network.then(resolve);
                setTimeout(function () {
                  if (network === null) {
                    // if prom isn't resolving after 500ms, then stop waiting
                    resolve();
                  }
                }, 500);
              });

            case 5:
              if (!(stateStore.network.get() != appNetworkId)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", undefined);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
}

export default network;