package main

import (
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	_ "github.com/heroku/x/hmetrics/onload"
)

func main() {
	port := os.Getenv("PORT")
	redis_url := os.Getenv("REDIS_URL")
	redis_password := ""

	redis_parsed_url, _ := url.Parse(redis_url)
	redis_password, _ = redis_parsed_url.User.Password()
	redis_url = redis_parsed_url.Host

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	if redis_url == "" {
		log.Fatal("$REDIS_URL must be set")
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr: redis_url, // use url from heroku environment
		Password: redis_password, // no password
		DB: 0, // default DB
	})

	router := gin.New()
	router.Use(gin.Logger())

	router.GET("/ping", func(c *gin.Context) {
		pong, err := redisClient.Ping().Result()
		if err != nil {
			log.Printf("Redis DB down or unreachable")
			c.String(http.StatusServiceUnavailable, "service temporarily down")
		} else {
			c.String(http.StatusOK, pong)
		}
	})

	router.Run(":" + port)
}
