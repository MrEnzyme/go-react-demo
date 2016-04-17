package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/googollee/go-socket.io"
)

func main() {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}

	server.On("connection", func(socket socketio.Socket) {
		log.Println("on connection")
		socket.Join("chat")
		socket.On("chat message", func(msg string) {
			socket.Emit("chat message", msg)
			log.Println("emit:", msg)
			socket.BroadcastTo("chat", "chat message", msg)
		})
		socket.On("disconnection", func() {
			log.Println("on disconnect")
		})
	})
	server.On("error", func(socket socketio.Socket, err error) {
		log.Println("error:", err)
	})

	webPort := os.Getenv("PORT")
	if webPort == "" {
		webPort = "5000"
	}
	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./client")))
	log.Printf("Serving on localhost:%s...", webPort)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", webPort), nil))
}
