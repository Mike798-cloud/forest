import http.server,socketserver,os
os.chdir(os.path.dirname(__file__))
class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address=True
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
with Server(("127.0.0.1",8765),Handler) as s:
    s.serve_forever()
