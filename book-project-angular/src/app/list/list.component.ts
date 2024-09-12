import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Book } from '../data/book';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { currentUser } from '../data/userData';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  firebaseConfig = {
    apiKey: "AIzaSyA970gnrfL9NNTRHm8Pj-HHiayCVQD0GZo",
    authDomain: "book-app-d90d1.firebaseapp.com",
    databaseURL: "https://book-app-d90d1-default-rtdb.firebaseio.com",
    projectId: "book-app-d90d1",
    storageBucket: "book-app-d90d1.appspot.com",
    messagingSenderId: "1019367376762",
    appId: "1:1019367376762:web:c759cb22843116796df8c3"
  };

  books: Array<Book> = [];
  key = "AIzaSyAukQn7svQJN1ZruG8UK26I-LKr3lcEbGk";
  app = initializeApp(this.firebaseConfig);
  auth = getAuth();
  db = getFirestore(this.app);
  user = this.auth.currentUser;
  library: any[];

  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user; // Set the user
        const docRef = doc(this.db, "users", this.user.uid);
        const docSnap = await getDoc(docRef);
        this.library = docSnap.data()['Library'];
        for (let i = 0; i < this.library.length; i++) {
          fetch(`https://www.googleapis.com/books/v1/volumes/${this.library[i]}?key=${this.key}`)
          .then(response => response.json())
          .then(result => {
                this.books[i] = result.volumeInfo;
                this.books[i].id = result.id;
          })  
        }
      } else {
        // Redirect to home page if no user is authenticated
        console.log("User is signed out");
        this.router.navigate(['/home']);
      }
    });
  }
}
