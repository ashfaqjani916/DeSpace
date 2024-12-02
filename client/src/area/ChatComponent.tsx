// import React, { useEffect, useState, useRef } from "react";
// import { io, Socket } from "socket.io-client";

// interface Ball {
//   id: string;
//   imageUrl: string;
//   position: { x: number; y: number };
// }

// const BallGame: React.FC = () => {
//   const socketRef = useRef<Socket | null>(null);
//   const [imageUrl, setImageUrl] = useState<string>("");
//   const [ballPosition, setBallPosition] = useState({ x: 200, y: 200 });
//   const [balls, setBalls] = useState<Ball[]>([]);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   // Obstacles on the map
//   const obstacles = [
//     { x: 100, y: 150, width: 50, height: 20 },
//     { x: 200, y: 300, width: 100, height: 30 },
//     { x: 400, y: 500, width: 70, height: 50 },
//     // Add more obstacles as needed
//   ];

//   const popUpTriggerObstacle = { x: 400, y: 500, width: 70, height: 50 };

//   useEffect(() => {
//     const SOCKET_URL = "http://localhost:3001";
//     const socket = io(SOCKET_URL, { transports: ["websocket"] });
//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log("Connected to WebSocket server");

//       if (socket && socket.id) {
//         const newBall: Ball = { id: socket.id, imageUrl, position: ballPosition };
//         socket.emit("joinGame", newBall);
//       }
//     });

//     socket.on("updateBalls", (updatedBalls: Ball[]) => {
//       setBalls(updatedBalls);
//     });

//     return () => {
//       socket.disconnect();
//       console.log("Disconnected from WebSocket server");
//     };
//   }, [imageUrl]);

//   const isColliding = (rect1: any, rect2: any) => {
//     return (
//       rect1.x < rect2.x + rect2.width &&
//       rect1.x + rect1.width > rect2.x &&
//       rect1.y < rect2.y + rect2.height &&
//       rect1.y + rect1.height > rect2.y
//     );
//   };

//   const moveBall = (dx: number, dy: number) => {
//     setBallPosition((prevPos) => {
//       const newPos = { x: prevPos.x + dx, y: prevPos.y + dy };

//       const ballRect = {
//         x: newPos.x - 20, // Ball's radius
//         y: newPos.y - 20,
//         width: 40,
//         height: 40,
//       };

//       // Check for collision
//       for (const obstacle of obstacles) {
//         if (isColliding(ballRect, obstacle)) {
//           if (isColliding(ballRect, popUpTriggerObstacle)) {
//             alert("Collision detected with the special obstacle!");
//           }
//           return prevPos; // Stop movement
//         }
//       }

//       if (socketRef.current) {
//         socketRef.current.emit("moveBall", { id: socketRef.current.id, position: newPos });
//       }
//       return newPos;
//     });
//   };

//   const handleKeyDown = (e: KeyboardEvent) => {
//     switch (e.key) {
//       case "ArrowUp":
//       case "w":
//       case "W":
//         moveBall(0, -10);
//         break;
//       case "ArrowDown":
//       case "s":
//       case "S":
//         moveBall(0, 10);
//         break;
//       case "ArrowLeft":
//       case "a":
//       case "A":
//         moveBall(-10, 0);
//         break;
//       case "ArrowRight":
//       case "d":
//       case "D":
//         moveBall(10, 0);
//         break;
//       default:
//         break;
//     }
//   };

//   const drawObstacles = (ctx: CanvasRenderingContext2D) => {
//     ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
//     obstacles.forEach((obstacle) => {
//       ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
//     });
//   };

//   const drawBalls = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         const background = new Image();
//         background.src = "../../public/images/unfold24.jpg";
//         background.onload = () => {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

//           drawObstacles(ctx);

//           balls.forEach((ball) => {
//             const img = new Image();
//             img.src = ball.imageUrl;
//             img.onload = () => {
//               ctx.save();
//               ctx.beginPath();
//               ctx.arc(ball.position.x, ball.position.y, 20, 0, 2 * Math.PI);
//               ctx.clip();
//               ctx.drawImage(img, ball.position.x - 20, ball.position.y - 20, 40, 40);
//               ctx.closePath();
//               ctx.restore();
//             };
//           });
//         };
//       }
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   useEffect(() => {
//     drawBalls();
//   }, [balls]);

//   return (
//     <div className="ball-game" style={{ display: "flex" }}>
//       <div
//         style={{
//           width: "200px",
//           padding: "10px",
//           backgroundColor: "#f4f4f4",
//           borderRight: "1px solid #ccc",
//         }}
//       >
//         <h3>Joined Users</h3>
//         {balls.map((ball) => (
//           <div key={ball.id} style={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
//             <div
//               style={{
//                 width: "20px",
//                 height: "20px",
//                 borderRadius: "50%",
//                 backgroundImage: `url(${ball.imageUrl})`,
//                 backgroundSize: "cover",
//                 marginRight: "10px",
//               }}
//             ></div>
//             <span>{ball.id.slice(0, 5)}</span>
//           </div>
//         ))}
//         <input
//           type="text"
//           placeholder="Enter image URL"
//           value={imageUrl}
//           onChange={(e) => setImageUrl(e.target.value)}
//           style={{ width: "100%", marginTop: "10px" }}
//         />
//       </div>

//       <div style={{ flexGrow: 1, textAlign: "center" }}>
//         <canvas
//           ref={canvasRef}
//           width={800}
//           height={700}
//           style={{
//             border: "1px solid black",
//             margin: "20px auto",
//             display: "block",
//           }}
//         ></canvas>
//         <div>Move the ball with arrow keys or WSAD keys!</div>
//       </div>
//     </div>
//   );
// };

// export default BallGame;


import SpinnerModal from "@/components/SpinningWheel";
import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Ball {
  id: string;
  imageUrl: string;
  position: { x: number; y: number };
}

const BallGame: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [ballPosition, setBallPosition] = useState({ x: 200, y: 200 });
  const [balls, setBalls] = useState<Ball[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Obstacles on the map
  const obstacles = [
    { x: 90, y: 150, width: 460, height: 10 },
    { x: 95, y: 210, width: 460, height: 10 },
    { x: 94, y: 273, width: 460, height: 7 },
    { x: 95, y: 330, width: 460, height: 7 },
    { x: 110, y: 400, width: 460, height: 7 },
    { x: 120, y: 460, width: 460, height: 10 },
    { x: 100, y: 530, width: 460, height: 10 },
    { x: 0, y: 380, width: 70, height: 150 },
    { x: 60, y: 100, width: 420, height: 1 },
    { x: 550, y: 20, width: 10, height: 90 },
    { x: 60, y: 20, width: 20, height: 80 },
    { x: -1, y: 20, width: 1, height: 700 },
    { x: 800, y: 20, width: 1, height: 700 },
    { x: 665, y: 20, width: 2, height: 100 },
    { x: 10, y: 0, width: 800, height: 0 },
    { x: 660, y: 330, width: 0, height: 75 },
    { x: 660, y: 190, width: 0, height: 75 },
    { x: 100, y: 50, width: 50, height: 50 },
    { x: 5, y: 592, width: 650, height: -1 },
    { x: 660, y: 470, width: 0, height: 120 },
    { x: 0, y: 705, width: 800, height: 0 },
    { x: 40, y: 695, width: 140, height: 120 },
    { x: 250, y: 695, width: 140, height: 20 },
    { x: 450, y: 695, width: 140, height: 20 },
    { x: 650, y: 695, width: 140, height: 20 },
  ];

  const popUpTriggerObstacle = [
    { x: 40, y: 695, width: 140, height: 120 },
    { x: 250, y: 695, width: 140, height: 20 },
    { x: 450, y: 695, width: 140, height: 20 },
    { x: 650, y: 695, width: 140, height: 20 }
  ];

  useEffect(() => {
    const SOCKET_URL = "http://localhost:3001";
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");

      if (socket && socket.id) {
        const newBall: Ball = { id: socket.id, imageUrl, position: ballPosition };
        socket.emit("joinGame", newBall);
      }
    });

    socket.on("updateBalls", (updatedBalls: Ball[]) => {
      setBalls(updatedBalls);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from WebSocket server");
    };
  }, [imageUrl]);

  const isColliding = (rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const moveBall = (dx: number, dy: number) => {
    setBallPosition((prevPos) => {
      const newPos = { x: prevPos.x + dx, y: prevPos.y + dy };

      const ballRect = {
        x: newPos.x - 20, // Ball's radius
        y: newPos.y - 20,
        width: 40,
        height: 40,
      };

      for (const obstacle of obstacles) {
        if (isColliding(ballRect, obstacle)) {
          // Check if collision is with a popup-triggering obstacle
          for (const popupObstacle of popUpTriggerObstacle) {
            if (isColliding(ballRect, popupObstacle)) {
              alert("Collision detected with a special obstacle!");
            }
          }
          return prevPos; // Stop movement
        }
      }


      if (socketRef.current) {
        socketRef.current.emit("moveBall", { id: socketRef.current.id, position: newPos });
      }
      return newPos;
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        moveBall(0, -10);
        break;
      case "ArrowDown":
      case "s":
      case "S":
        moveBall(0, 10);
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        moveBall(-10, 0);
        break;
      case "ArrowRight":
      case "d":
      case "D":
        moveBall(10, 0);
        break;
      default:
        break;
    }
  };

  const drawObstacles = (ctx: CanvasRenderingContext2D) => {
    // ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    // obstacles.forEach((obstacle) => {
    //   ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    // });
  };

  const drawBalls = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const background = new Image();
        background.src = "/images/unfold24.jpg";
        background.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

          drawObstacles(ctx);

          balls.forEach((ball) => {
            const img = new Image();
            img.src = ball.imageUrl;
            img.onload = () => {
              ctx.save();
              ctx.beginPath();
              ctx.arc(ball.position.x, ball.position.y, 20, 0, 2 * Math.PI);
              ctx.clip();
              ctx.drawImage(img, ball.position.x - 20, ball.position.y - 20, 40, 40);
              ctx.closePath();
              ctx.restore();
            };
          });
        };
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    drawBalls();
  }, [balls]);

  return (
    <div className="ball-game" style={{ display: "flex" }}>
      <SpinnerModal />
      <div
        style={{
          width: "200px",
          padding: "10px",
          backgroundColor: "#f4f4f4",
          borderRight: "1px solid #ccc",
        }}
      >
        <h3>Joined Users</h3>
        {balls.map((ball) => (
          <div key={ball.id} style={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundImage: `url(${ball.imageUrl})`,
                backgroundSize: "cover",
                marginRight: "10px",
              }}
            ></div>
            <span>{ball.id.slice(0, 5)}</span>
          </div>
        ))}
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: "100%", marginTop: "10px" }}
        />
      </div>

      <div style={{ flexGrow: 1, textAlign: "center" }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={700}
          style={{
            border: "1px solid black",
            margin: "20px auto",
            display: "block",
          }}
        ></canvas>
        <div>Move the ball with arrow keys or WSAD keys!</div>
      </div>
    </div>
  );
};

export default BallGame;


// import React, { useEffect, useState, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';
// import  '../../public/images/unfold24.jpg'

// interface Ball {
//   id: string;
//   imageUrl: string;
//   position: { x: number; y: number };
// }

// const BallGame: React.FC = () => {
//   const socketRef = useRef<Socket | null>(null);
//   const [imageUrl, setImageUrl] = useState<string>('');
//   const [ballPosition, setBallPosition] = useState({ x: 200, y: 200 });
//   const [balls, setBalls] = useState<Ball[]>([]);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const SOCKET_URL = 'http://localhost:3001';
//     const socket = io(SOCKET_URL, { transports: ['websocket'] });
//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('Connected to WebSocket server');

//       if (socket && socket.id) {
//         const newBall: Ball = { id: socket.id, imageUrl, position: ballPosition };
//         socket.emit('joinGame', newBall);
//       }
//     });

//     socket.on('updateBalls', (updatedBalls: Ball[]) => {
//       setBalls(updatedBalls);
//     });

//     return () => {
//       socket.disconnect();
//       console.log('Disconnected from WebSocket server');
//     };
//   }, [imageUrl]);

//   const moveBall = (dx: number, dy: number) => {
//     setBallPosition((prevPos) => {
//       const newX = prevPos.x + dx;
//       const newY = prevPos.y + dy;
//       const newPos = { x: newX, y: newY };

//       if (socketRef.current) {
//         socketRef.current.emit('moveBall', { id: socketRef.current.id, position: newPos });
//       }
//       console.log("moving ball");
//       return newPos;
//     });
//   };

//   const handleKeyDown = (e: KeyboardEvent) => {
//     console.log("Event")
//     switch (e.key) {
//       case 'ArrowUp':
//       case 'w':
//       case 'W':
//         moveBall(0, -10);
//         break;
//       case 'ArrowDown':
//       case 's':
//       case 'S':
//         moveBall(0, 10);
//         break;
//       case 'ArrowLeft':
//       case 'a':
//       case 'A':
//         moveBall(-10, 0);
//         break;
//       case 'ArrowRight':
//       case 'd':
//       case 'D':
//         moveBall(10, 0);
//         break;
//       case 'q':
//       case 'Q':
//         moveBall(-10, -10);
//         break;
//       case 'e':
//       case 'E':
//         moveBall(10, -10);
//         break;
//       case 'z':
//       case 'Z':
//         moveBall(-10, 10);
//         break;
//       case 'c':
//       case 'C':
//         moveBall(10, 10);
//         break;
//       default:
//         break;
//     }
//   };

//   const drawBalls = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         const background = new Image();
//         background.src = '../../public/images/unfold24.jpg';
//         background.onload = () => {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//           ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

//           balls.forEach((ball) => {
//             const img = new Image();
//             img.src = ball.imageUrl;
//             img.onload = () => {
//               ctx.save();
//               ctx.beginPath();
//               ctx.arc(ball.position.x, ball.position.y, 20, 0, 2 * Math.PI);
//               ctx.clip();
//               ctx.drawImage(img, ball.position.x - 20, ball.position.y - 20, 40, 40);
//               ctx.closePath();
//               ctx.restore();
//             };
//           });
//         };
//       }
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);

//   useEffect(() => {
//     drawBalls();
//   }, [balls]);

//   return (
//     <div className="ball-game" style={{ display: 'flex' }}>
//       <div style={{ width: '200px', padding: '10px', backgroundColor: '#f4f4f4', borderRight: '1px solid #ccc' }}>
//         <h3>Joined Users</h3>
//         {balls.map((ball) => (
//           <div key={ball.id} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
//             <div
//               style={{
//                 width: '20px',
//                 height: '20px',
//                 borderRadius: '50%',
//                 backgroundImage: `url(${ball.imageUrl})`,
//                 backgroundSize: 'cover',
//                 marginRight: '10px',
//               }}
//             ></div>
//             <span>{ball.id.slice(0, 5)}</span>
//           </div>
//         ))}
//         <input
//           type="text"
//           placeholder="Enter image URL"
//           value={imageUrl}
//           onChange={(e) => setImageUrl(e.target.value)}
//           style={{ width: '100%', marginTop: '10px' }}
//         />
//       </div>

//       <div style={{ flexGrow: 1, textAlign: 'center' }}>
//         <canvas
//           ref={canvasRef}
//           width={800}
//           height={700}
//           style={{
//             border: '1px solid black',
//             margin: '20px auto',
//             display: 'block',
//           }}
//         ></canvas>
//         <div>Move the ball with arrow keys, WSAD keys, or QEZC keys for diagonal movement!</div>
//       </div>
//     </div>
//   );
// };

// export default BallGame;
