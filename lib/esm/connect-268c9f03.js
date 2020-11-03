function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import 'regenerator-runtime/runtime';
import { c as connectIcon } from './onboard-2004c9f5.js';
import 'bignumber.js';
import 'bnc-sdk';
import 'bowser';

function connect() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var heading = options.heading,
      description = options.description,
      icon = options.icon,
      html = options.html,
      button = options.button;
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stateAndHelpers) {
      var wallet, address, stateSyncStatus, stateStore;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              wallet = stateAndHelpers.wallet, address = stateAndHelpers.address, stateSyncStatus = stateAndHelpers.stateSyncStatus, stateStore = stateAndHelpers.stateStore;

              if (!(address === null)) {
                _context.next = 5;
                break;
              }

              if (!stateSyncStatus.address) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return new Promise(function (resolve) {
                stateSyncStatus.address && stateSyncStatus.address.then(resolve);
                setTimeout(function () {
                  if (address === null) {
                    // if prom isn't resolving after 500ms, then stop waiting
                    resolve();
                  }
                }, 500);
              });

            case 5:
              if (!(!stateStore.address.get() && wallet && wallet.name)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", {
                heading: heading || 'Login and Authorize Your Wallet',
                description: description || "This dapp requires access to your wallet, please login and authorize access to your ".concat(wallet.name, " accounts to continue."),
                eventCode: 'loginFail',
                action: wallet.connect,
                icon: icon || connectIcon,
                html: html,
                button: button
              });

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

export default connect;