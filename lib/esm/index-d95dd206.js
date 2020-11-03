function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var crypto = require('crypto');

var EventEmitter = require('events').EventEmitter;

var SDK = require('gridplus-sdk');

var keyringType = 'Lattice Hardware';
var HARDENED_OFFSET = 0x80000000;
var PER_PAGE = 5;

var LatticeKeyring = /*#__PURE__*/function (_EventEmitter) {
  _inherits(LatticeKeyring, _EventEmitter);

  var _super = _createSuper(LatticeKeyring);

  function LatticeKeyring() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LatticeKeyring);

    _this = _super.call(this);
    _this.type = keyringType;

    _this._resetDefaults();

    _this.deserialize(opts);

    return _this;
  } //-------------------------------------------------------------------
  // Keyring API (per `https://github.com/MetaMask/eth-simple-keyring`)
  //-------------------------------------------------------------------


  _createClass(LatticeKeyring, [{
    key: "deserialize",
    value: function deserialize() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (opts.creds) this.creds = opts.creds;
      if (opts.accounts) this.accounts = opts.accounts;
      if (opts.walletUID) this.walletUID = opts.walletUID;
      if (opts.name) this.name = opts.name;
      if (opts.network) this.network = opts.network;
      return Promise.resolve();
    }
  }, {
    key: "serialize",
    value: function serialize() {
      return Promise.resolve({
        creds: this.creds,
        accounts: this.accounts,
        walletUID: this.walletUID,
        name: this.name,
        network: this.network
      });
    }
  }, {
    key: "isUnlocked",
    value: function isUnlocked() {
      return this._hasCreds() && this._hasSession();
    }
  }, {
    key: "setHdPath",
    value: function setHdPath() {
      console.warn("setHdPath not implemented.");
      return;
    } // Initialize a session with the Lattice1 device using the GridPlus SDK

  }, {
    key: "unlock",
    value: function unlock() {
      var _this2 = this;

      var updateData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return new Promise(function (resolve, reject) {
        _this2._getCreds().then(function (creds) {
          if (creds) {
            _this2.creds.deviceID = creds.deviceID;
            _this2.creds.password = creds.password;
          }

          return _this2._initSession();
        }).then(function () {
          return _this2._connect(updateData);
        }).then(function () {
          return resolve('Unlocked');
        })["catch"](function (err) {
          return reject(Error(err));
        });
      });
    } // Add addresses to the local store and return the full result

  }, {
    key: "addAccounts",
    value: function addAccounts() {
      var _this3 = this;

      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return new Promise(function (resolve, reject) {
        _this3.unlock().then(function () {
          return _this3._fetchAddresses(n, _this3.unlockedAccount);
        }).then(function (addrs) {
          var _this3$accounts;

          // Splice the new account(s) into `this.accounts`
          _this3.accounts.splice(_this3.unlockedAccount, n);

          (_this3$accounts = _this3.accounts).splice.apply(_this3$accounts, [_this3.unlockedAccount, 0].concat(_toConsumableArray(addrs)));

          return resolve(_this3.accounts);
        })["catch"](function (err) {
          return reject(err);
        });
      });
    } // Return the local store of addresses

  }, {
    key: "getAccounts",
    value: function getAccounts() {
      return Promise.resolve(this.accounts ? this.accounts.slice() : [].slice());
    }
  }, {
    key: "signTransaction",
    value: function signTransaction(address, tx) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._unlockAndFindAccount(address).then(function (addrIdx) {
          // Build the Lattice request data and make request
          var txData = {
            chainId: tx.getChainId(),
            nonce: Number("0x".concat(tx.nonce.toString('hex'))) || 0,
            gasPrice: Number("0x".concat(tx.gasPrice.toString('hex'))),
            gasLimit: Number("0x".concat(tx.gasLimit.toString('hex'))),
            to: "0x".concat(tx.to.toString('hex')),
            value: Number("0x".concat(tx.value.toString('hex'))),
            data: tx.data.length === 0 ? null : "0x".concat(tx.data.toString('hex')),
            signerPath: [HARDENED_OFFSET + 44, HARDENED_OFFSET + 60, HARDENED_OFFSET, 0, addrIdx]
          };
          return _this4._signTxData(txData);
        }).then(function (signedTx) {
          // Add the sig params. `signedTx = { sig: { v, r, s }, tx, txHash}`
          if (!signedTx.sig || !signedTx.sig.v || !signedTx.sig.r || !signedTx.sig.s) return reject(Error('No signature returned'));
          tx.v = signedTx.sig.v;
          tx.r = Buffer.from(signedTx.sig.r, 'hex');
          tx.s = Buffer.from(signedTx.sig.s, 'hex');
          return resolve(tx);
        })["catch"](function (err) {
          return reject(Error(err));
        });
      });
    }
  }, {
    key: "signMessage",
    value: function signMessage(address, data) {
      console.warn('NOTE: signMessage is currently a proxy for signPersonalMessage!');
      return this.signPersonalMessage(address, data);
    }
  }, {
    key: "signPersonalMessage",
    value: function signPersonalMessage(address, data) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5._unlockAndFindAccount(address).then(function (addrIdx) {
          var req = {
            currency: 'ETH_MSG',
            data: {
              protocol: 'signPersonal',
              payload: data,
              signerPath: [HARDENED_OFFSET + 44, HARDENED_OFFSET + 60, HARDENED_OFFSET, 0, addrIdx]
            }
          };
          if (!_this5._hasSession()) return reject('No SDK session started. Cannot sign transaction.');

          _this5.sdkSession.sign(req, function (err, res) {
            if (err) return reject(err);
            if (!res.sig) return reject('No signature returned');
            var v = (res.sig.v - 27).toString(16);
            if (v.length < 2) v = "0".concat(v);
            return resolve("0x".concat(res.sig.r).concat(res.sig.s).concat(v));
          });
        });
      });
    }
  }, {
    key: "exportAccount",
    value: function exportAccount(address) {
      return Promise.reject(Error('exportAccount not supported by this device'));
    }
  }, {
    key: "removeAccount",
    value: function removeAccount(address) {
      // We only allow one account at a time, so removing any account
      // should result in a state reset. The user will need to reconnect
      // to the Lattice
      this.forgetDevice();
    }
  }, {
    key: "getFirstPage",
    value: function getFirstPage() {
      this.page = 0;
      return this._getPage(1);
    }
  }, {
    key: "getNextPage",
    value: function getNextPage() {
      return this.getFirstPage();
    }
  }, {
    key: "getPreviousPage",
    value: function getPreviousPage() {
      return this.getFirstPage();
    }
  }, {
    key: "setAccountToUnlock",
    value: function setAccountToUnlock(index) {
      this.unlockedAccount = parseInt(index, 10);
    }
  }, {
    key: "forgetDevice",
    value: function forgetDevice() {
      this._resetDefaults();
    } //-------------------------------------------------------------------
    // Internal methods and interface to SDK
    //-------------------------------------------------------------------

  }, {
    key: "_unlockAndFindAccount",
    value: function _unlockAndFindAccount(address) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        // NOTE: We are passing `false` here because we do NOT want
        // state data to be updated as a result of a transaction request.
        // It is possible the user inserted or removed a SafeCard and
        // will not be able to sign this transaction. If that is the
        // case, we just want to return an error message
        _this6.unlock(false).then(function () {
          return _this6.getAccounts();
        }).then(function (addrs) {
          // Find the signer in our current set of accounts
          // If we can't find it, return an error
          var addrIdx = null;
          addrs.forEach(function (addr, i) {
            if (address.toLowerCase() === addr.toLowerCase()) addrIdx = i;
          });
          if (addrIdx === null) return reject('Signer not present');
          return resolve(addrIdx);
        })["catch"](function (err) {
          return reject(err);
        });
      });
    }
  }, {
    key: "_resetDefaults",
    value: function _resetDefaults() {
      this.accounts = [];
      this.isLocked = true;
      this.creds = {
        deviceID: null,
        password: null
      };
      this.walletUID = null;
      this.sdkSession = null;
      this.page = 0;
      this.unlockedAccount = 0;
      this.network = null;
    }
  }, {
    key: "_getCreds",
    value: function _getCreds() {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        // We only need to setup if we don't have a deviceID
        if (_this7._hasCreds()) return resolve(); // If we are not aware of what Lattice we should be talking to,
        // we need to open a window that lets the user go through the
        // pairing or connection process.

        var name = _this7.name ? _this7.name : 'Unknown';
        var base = 'https://wallet.gridplus.io';
        if (_this7.network && _this7.network !== 'mainnet') base = 'https://gridplus-web-wallet-dev.herokuapp.com';
        var url = "".concat(base, "?keyring=").concat(name);
        if (_this7.network) url += "&network=".concat(_this7.network);
        var popup = window.open(url);
        popup.postMessage('GET_LATTICE_CREDS', base); // PostMessage handler

        function receiveMessage(event) {
          // Ensure origin
          if (event.origin !== base) return; // Parse response data

          try {
            var data = JSON.parse(event.data);
            if (!data.deviceID || !data.password) return reject(Error('Invalid credentials returned from Lattice.'));
            return resolve(data);
          } catch (err) {
            return reject(err);
          }
        }

        window.addEventListener("message", receiveMessage, false);
      });
    } // [re]connect to the Lattice. This should be done frequently to ensure
    // the expected wallet UID is still the one active in the Lattice.
    // This will handle SafeCard insertion/removal events.
    // updateData - true if you want to overwrite walletUID and accounts in
    //              the event that we find we are not synced.
    //              If left false and we notice a new walletUID, we will
    //              return an error.

  }, {
    key: "_connect",
    value: function _connect(updateData) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        _this8.sdkSession.connect(_this8.creds.deviceID, function (err) {
          if (err) return reject(err); // Save the current wallet UID

          var activeWallet = _this8.sdkSession.getActiveWallet();

          if (!activeWallet || !activeWallet.uid) return reject("No active wallet");
          var newUID = activeWallet.uid.toString('hex'); // If we fetched a walletUID that does not match our current one,
          // reset accounts and update the known UID

          if (newUID != _this8.walletUID) {
            // If we don't want to update data, return an error
            if (updateData === false) return reject('Wallet has changed! Please reconnect.'); // By default we should clear out accounts and update with
            // the new walletUID. We should NOT fill in the accounts yet,
            // as we reserve that functionality to `addAccounts`

            _this8.accounts = [];
            _this8.walletUID = newUID;
          }

          return resolve();
        });
      });
    }
  }, {
    key: "_initSession",
    value: function _initSession() {
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        if (_this9._hasSession()) return resolve();

        try {
          var url = 'https://signing.gridpl.us';
          if (_this9.network && _this9.network !== 'mainnet') url = 'https://signing.staging-gridpl.us';
          var setupData = {
            name: _this9.name,
            baseUrl: url,
            crypto: crypto,
            timeout: 120000,
            privKey: _this9._genSessionKey(),
            network: _this9.network
          };
          _this9.sdkSession = new SDK.Client(setupData);
          return resolve();
        } catch (err) {
          return reject(err);
        }
      });
    }
  }, {
    key: "_fetchAddresses",
    value: function _fetchAddresses() {
      var _this10 = this;

      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return new Promise(function (resolve, reject) {
        if (!_this10._hasSession()) return reject('No SDK session started. Cannot fetch addresses.'); // The Lattice does not allow for us to skip indices.

        if (i > _this10.accounts.length) return reject("Requested address is out of bounds. You may only request index <".concat(_this10.accounts.length)); // If we have already cached the address(es), we don't need to do it again

        if (_this10.accounts.length > i) return resolve(_this10.accounts.slice(i, n)); // Make the request to get the requested address

        var addrData = {
          currency: 'ETH',
          startPath: [HARDENED_OFFSET + 44, HARDENED_OFFSET + 60, HARDENED_OFFSET, 0, i],
          n: n // Only request one at a time. This module only supports ETH, so no gap limits

        };

        _this10.sdkSession.getAddresses(addrData, function (err, addrs) {
          if (err) return reject(Error("Error getting addresses: ".concat(err))); // Sanity check -- if this returned 0 addresses, handle the error

          if (addrs.length < 1) return reject('No addresses returned'); // Return the addresses we fetched *without* updating state

          return resolve(addrs);
        });
      });
    }
  }, {
    key: "_signTxData",
    value: function _signTxData(txData) {
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        if (!_this11._hasSession()) return reject('No SDK session started. Cannot sign transaction.');

        _this11.sdkSession.sign({
          currency: 'ETH',
          data: txData
        }, function (err, res) {
          if (err) return reject(err);
          if (!res.tx) return reject('No transaction payload returned.');
          return resolve(res);
        });
      });
    }
  }, {
    key: "_getPage",
    value: function _getPage() {
      var _this12 = this;

      var increment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return new Promise(function (resolve, reject) {
        _this12.page += increment;
        if (_this12.page <= 0) _this12.page = 1;
        var start = PER_PAGE * (_this12.page - 1);
        var to = PER_PAGE * _this12.page;

        _this12.unlock().then(function () {
          // V1: We will only support export of one (the first) address
          return _this12._fetchAddresses(1, 0); //-----------
        }).then(function (addrs) {
          // Build some account objects from the addresses
          var localAccounts = [];
          addrs.forEach(function (addr, i) {
            localAccounts.push({
              address: addr,
              balance: null,
              index: start + i
            });
          });
          return resolve(localAccounts);
        })["catch"](function (err) {
          return reject(err);
        });
      });
    }
  }, {
    key: "_hasCreds",
    value: function _hasCreds() {
      return this.creds.deviceID !== null && this.creds.password !== null && this.name;
    }
  }, {
    key: "_hasSession",
    value: function _hasSession() {
      return this.sdkSession && this.walletUID;
    }
  }, {
    key: "_genSessionKey",
    value: function _genSessionKey() {
      if (!this._hasCreds()) throw new Error('No credentials -- cannot create session key!');
      var buf = Buffer.concat([Buffer.from(this.creds.password), Buffer.from(this.creds.deviceID), Buffer.from(this.name)]);
      return crypto.createHash('sha256').update(buf).digest();
    }
  }]);

  return LatticeKeyring;
}(EventEmitter);

LatticeKeyring.type = keyringType;
module.exports = LatticeKeyring;