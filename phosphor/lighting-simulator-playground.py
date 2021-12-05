#!/usr/bin/env python

import asyncio
from asyncio.tasks import sleep
import websockets
import time


colors = [
  "pink",
  "yellow",
  "cyan",
  "magenta"
]

async def handleMessage(websocket, path):
  while True:
    message = await websocket.recv()
    for color in colors:
      await websocket.send(color)
      await asyncio.sleep(2)
      print(message)


start_server = websockets.serve(handleMessage, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()