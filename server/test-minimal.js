import http from 'http';

console.log('Script starting...');

const server = http.createServer((req, res) => {
  console.log('Request received!');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

console.log('Server object created');

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Minimal server listening on port 5000');
  console.log('Server address:', server.address());
});

console.log('Listen called...');

// Keepalive
const interval = setInterval(() => {
  console.log('Still alive...', new Date().toLocaleTimeString());
}, 3000);

console.log('Keepalive set, script end reached');
