export default [
  {
      "inputs": [],
      "name": "ActionMismatch",
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
      "inputs": [
          {
              "internalType": "address",
              "name": "player",
              "type": "address"
          }
      ],
      "name": "currentRoom",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
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
          },
          {
              "internalType": "uint256",
              "name": "turn",
              "type": "uint256"
          }
      ],
      "name": "getActions",
      "outputs": [
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
          },
          {
              "internalType": "uint256",
              "name": "nth",
              "type": "uint256"
          }
      ],
      "name": "getRevealCard",
      "outputs": [
          {
              "internalType": "uint256[2]",
              "name": "card",
              "type": "uint256[2]"
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
          },
          {
              "internalType": "uint256",
              "name": "playerIndex",
              "type": "uint256"
          }
      ],
      "name": "getShuffledCards",
      "outputs": [
          {
              "internalType": "uint256[4][20]",
              "name": "shuffled",
              "type": "uint256[4][20]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "maxRoomId",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "moduleMethods",
      "outputs": [
          {
              "internalType": "bytes4[]",
              "name": "",
              "type": "bytes4[]"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "moduleName",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "pure",
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
      "name": "roomInfo",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "address",
                      "name": "player1",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "player2",
                      "type": "address"
                  },
                  {
                      "internalType": "uint256",
                      "name": "player1Cards",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "player2Cards",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "startTime",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "endTime",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "turns",
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
                      "internalType": "struct EdOnBN254.Point[3]",
                      "name": "pk",
                      "type": "tuple[3]"
                  },
                  {
                      "internalType": "bool[2]",
                      "name": "shuffleVerified",
                      "type": "bool[2]"
                  },
                  {
                      "internalType": "bool",
                      "name": "player2sTurnStart",
                      "type": "bool"
                  },
                  {
                      "internalType": "uint256",
                      "name": "stateHash",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "lastUpdateTime",
                      "type": "uint256"
                  },
                  {
                      "internalType": "enum ITCGStorage.GameState",
                      "name": "state",
                      "type": "uint8"
                  },
                  {
                      "internalType": "bool[2]",
                      "name": "revealedFirst",
                      "type": "bool[2]"
                  },
                  {
                      "internalType": "bool[2]",
                      "name": "shuffleRemasked",
                      "type": "bool[2]"
                  }
              ],
              "internalType": "struct ITCGStorage.RoomDTO",
              "name": "",
              "type": "tuple"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "turnTimeOut",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "turn",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "shuffle",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
] as const;
