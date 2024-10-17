const dgram = require("dgram");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

//Uncomment this block to pass the first stage

const udpSocket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1");

udpSocket.on("message", (buf, rinfo) => {
  
    //const response = Buffer.from("");
    const dnsResponse = Buffer.alloc(12);

   // 1. Packet Identifier (ID): 16 bits=> 2byte(0,1 -> index)
  // Set to 1234 (0x04D2 in hex)
  dnsResponse.writeUInt16BE(0x04D2, 0); // Write ID at offset 0 (16 bits)
  
  // 2. QR (1 bit), OPCODE (4 bits), AA (1 bit), TC (1 bit), RD (1 bit)
  // QR = 1 (response), OPCODE = 0(0000), AA = 0, TC = 0, RD = 0
dnsResponse[2] = 0b100000

// 3. RA (1 bit), Z (3 bits), RCODE (4 bits)
  // RA = 0, Z = 000, RCODE = 0000
  dnsResponse[3] = 0b00000000; // Second byte, all values set to 0
// 4. QDCOUNT: Number of questions (16 bits)
  // Set to 0
  dnsResponse.writeUInt16BE(0, 4);

  // 5. ANCOUNT: Number of answers (16 bits)
  // Set to 0
  dnsResponse.writeUInt16BE(0, 6);

  // 6. NSCOUNT: Number of authority records (16 bits)
  // Set to 0
  dnsResponse.writeUInt16BE(0, 8);

  // 7. ARCOUNT: Number of additional records (16 bits)
  // Set to 0
  dnsResponse.writeUInt16BE(0, 10);

  // Send the response back to the client (tester)
  udpSocket.send(dnsResponse, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error(`Error sending response: ${err}`);
    } else {
      console.log(`Sent response to ${rinfo.address}:${rinfo.port}`);
    }
  });
  })

udpSocket.on("error", (err) => {
  console.log(`Error: ${err}`);
});

udpSocket.on("listening", () => {
  const address = udpSocket.address();
  console.log(`Server listening ${address.address}:${address.port}`);
});


