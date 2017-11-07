import { initializeApp } from 'firebase';

export const databaseConfig = {
	apiKey: "AIzaSyBc1h3JHw_yvH8c9LJdZr6YtO6NUgffILw",
	authDomain: "blueprint-1e7a3.firebaseapp.com",
	databaseURL: "https://blueprint-1e7a3.firebaseio.com",
	projectId: "blueprint-1e7a3",
	storageBucket: "blueprint-1e7a3.appspot.com",
	messagingSenderId: "1008432886695"
};

export const fbDatabase = initializeApp(databaseConfig, 'database').database();