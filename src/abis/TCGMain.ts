export default [
  {
    "inputs": [],
    "name": "AccessControlBadConfirmation",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "neededRole",
        "type": "bytes32"
      }
    ],
    "name": "AccessControlUnauthorizedAccount",
    "type": "error"
  },
  {
        "inputs": [],
        "name": "ActionMismatch",
        "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "AddressEmptyCode",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyJoined",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyShuffled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EOAOnly",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "ERC1967InvalidImplementation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERC1967NonPayable",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedInnerCall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAction",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidArguments",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "modName",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "prevModAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "nextModAddress",
        "type": "address"
      }
    ],
    "name": "InvalidModuleAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidPreset",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidProof",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidStarter",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidTurn",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "modName",
        "type": "string"
      }
    ],
    "name": "ModuleNotExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotJoined",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Timeout",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UUPSUnauthorizedCallContext",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "slot",
        "type": "bytes32"
      }
    ],
    "name": "UUPSUnsupportedProxiableUUID",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "WrongRoom",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roomId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      }
    ],
    "name": "GameOver",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roomId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player1",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player2",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "startWithPlayer2",
        "type": "bool"
      }
    ],
    "name": "GameStart",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bytes4",
        "name": "sig",
        "type": "bytes4"
      }
    ],
    "name": "ModuleFunctionAttached",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes4",
        "name": "sig",
        "type": "bytes4"
      }
    ],
    "name": "ModuleFunctionDetached",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "ModuleUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roomId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "turn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "actionIndex",
        "type": "uint256"
      }
    ],
    "name": "ProofCheat",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roomId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "turn",
        "type": "uint256"
      }
    ],
    "name": "StartTurn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "UPGRADE_INTERFACE_VERSION",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roomId",
        "type": "uint256"
      }
    ],
    "name": "claimTurnTimeout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "roomId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "turn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "internalType": "struct ITCGStorage.ActionIndex",
        "name": "ai",
        "type": "tuple"
      }
    ],
    "name": "disproveCardDrawn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "roomId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "turn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "internalType": "struct ITCGStorage.ActionIndex",
        "name": "ai",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256[2]",
            "name": "a",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[2][2]",
            "name": "b",
            "type": "uint256[2][2]"
          },
          {
            "internalType": "uint256[2]",
            "name": "c",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[]",
            "name": "pi",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct ITCGStorage.ZkProof",
        "name": "zkp",
        "type": "tuple"
      }
    ],
    "name": "disproveDefeat",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "roomId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "turn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "internalType": "struct ITCGStorage.ActionIndex",
        "name": "ai",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256[2]",
            "name": "a",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[2][2]",
            "name": "b",
            "type": "uint256[2][2]"
          },
          {
            "internalType": "uint256[2]",
            "name": "c",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[]",
            "name": "pi",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct ITCGStorage.ZkProof",
        "name": "zkp",
        "type": "tuple"
      }
    ],
    "name": "disproveEndTurn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "roomId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "turn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "internalType": "struct ITCGStorage.ActionIndex",
        "name": "ai",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256[2]",
            "name": "a",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[2][2]",
            "name": "b",
            "type": "uint256[2][2]"
          },
          {
            "internalType": "uint256[2]",
            "name": "c",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[]",
            "name": "pi",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct ITCGStorage.ZkProof",
        "name": "zkp",
        "type": "tuple"
      }
    ],
    "name": "disproveHeroAttack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "roomId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "turn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "internalType": "struct ITCGStorage.ActionIndex",
        "name": "ai",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256[2]",
            "name": "a",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[2][2]",
            "name": "b",
            "type": "uint256[2][2]"
          },
          {
            "internalType": "uint256[2]",
            "name": "c",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[]",
            "name": "pi",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct ITCGStorage.ZkProof",
        "name": "zkp",
        "type": "tuple"
      }
    ],
    "name": "disproveHeroSkill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "roomId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "turn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "internalType": "struct ITCGStorage.ActionIndex",
        "name": "ai",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256[2]",
            "name": "a",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[2][2]",
            "name": "b",
            "type": "uint256[2][2]"
          },
          {
            "internalType": "uint256[2]",
            "name": "c",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[]",
            "name": "pi",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct ITCGStorage.ZkProof",
        "name": "zkp",
        "type": "tuple"
      }
    ],
    "name": "disproveMinionAttack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "roomId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "turn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "internalType": "struct ITCGStorage.ActionIndex",
        "name": "ai",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256[2]",
            "name": "a",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[2][2]",
            "name": "b",
            "type": "uint256[2][2]"
          },
          {
            "internalType": "uint256[2]",
            "name": "c",
            "type": "uint256[2]"
          },
          {
            "internalType": "uint256[]",
            "name": "pi",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct ITCGStorage.ZkProof",
        "name": "zkp",
        "type": "tuple"
      }
    ],
    "name": "disprovePlayCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "shuffleVerifier",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "revealVerifier",
        "type": "address"
      },
      {
        "internalType": "contract MimcSponge",
        "name": "mimcSponge",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "preset",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "x",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "y",
            "type": "uint256"
          }
        ],
        "internalType": "struct EdOnBN254.Point",
        "name": "pk",
        "type": "tuple"
      }
    ],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "quitGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "callerConfirmation",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ZgModule",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "setModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "disableShuffleVerify",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "disableRevealVerify",
        "type": "bool"
      }
    ],
    "name": "setShuffleRevealConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32[]",
        "name": "vids",
        "type": "bytes32[]"
      },
      {
        "internalType": "address[]",
        "name": "verifiers",
        "type": "address[]"
      }
    ],
    "name": "setVerifier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ZgModule",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "unsetModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "enum ITCGStorage.ActionKind",
            "name": "kind",
            "type": "uint8"
          },
          {
            "internalType": "uint128",
            "name": "cardId",
            "type": "uint128"
          },
          {
            "internalType": "uint256",
            "name": "params",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nthDrawn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stateHash",
            "type": "uint256"
          },
          {
            "internalType": "uint256[2]",
            "name": "rtoken",
            "type": "uint256[2]"
          }
        ],
        "internalType": "struct ITCGStorage.Action[]",
        "name": "actions",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256[2]",
            "name": "card",
            "type": "uint256[2]"
          },
          {
            "internalType": "bytes",
            "name": "proof",
            "type": "bytes"
          }
        ],
        "internalType": "struct ITCGStorage.RevealToken",
        "name": "token",
        "type": "tuple"
      }
    ],
    "name": "uploadActions",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "proof",
        "type": "bytes"
      },
      {
        "internalType": "uint256[]",
        "name": "publicKeyInput",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "publicKeyCommitment",
        "type": "uint256[]"
      },
      {
        "internalType": "bool",
        "name": "remask",
        "type": "bool"
      }
    ],
    "name": "verifyShuffle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
          },
          {
              "components": [
                  {
                      "internalType": "uint256[2]",
                      "name": "card",
                      "type": "uint256[2]"
                  },
                  {
                      "internalType": "bytes",
                      "name": "proof",
                      "type": "bytes"
                  }
              ],
              "internalType": "struct ITCGStorage.RevealToken",
              "name": "token",
              "type": "tuple"
          }
      ],
      "name": "revealStart",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
] as const;
