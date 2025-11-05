# App Dev Pulse: The All-in-One Employee Engagement App

**Presenter:** [Your Name]
**Time Allotment:** 10 Minutes

---

### 1. Introduction & Vision (1 Minute)

**What is Pulse?**

Pulse, created by App Dev, is a modern, mobile-first application designed to be the digital heart of our company. It's an internal tool built to boost employee engagement, streamline communication, and foster a connected, positive work culture.

**The Problem We're Solving:**

In a growing company, it's easy for communication to become fragmented. Important news gets lost in emails, peer recognition goes unnoticed, and it's hard to get a "pulse" on company morale. The Pulse app solves this by centralizing these key interactions into a single, engaging platform.

---

### 2. Core Technologies (1 Minute)

Pulse is built on a robust and scalable tech stack, allowing for rapid development and a seamless user experience.

*   **Frontend:** **React Native** with **Expo**. This allows us to write code once and deploy it as a native application on both iOS and Android, saving significant development time.

*   **Backend & Database:** **Google Firebase**. We leverage several of Firebase's powerful services:
    *   **Firebase Authentication:** For secure and easy-to-manage user sign-up and login.
    *   **Firestore (NoSQL Database):** This is our primary database for storing structured data like user profiles, articles, kudos, and comments. It's scalable and offers powerful real-time data synchronization.
    *   **Firebase Realtime Database:** Used specifically for our Company Chat and live polls, where extremely low-latency, real-time updates are critical for a great chat experience.
    *   **Expo Push Notifications:** Integrated with Firebase to send real-time alerts to users' devices, keeping them informed of status updates and other important events.

---

### 3. Application Demo (6 Minutes)

*(This is the script for your live demo of the app on a physical device or simulator.)*

**A. Onboarding: Secure & Simple (30 seconds)**

> "Let's start with the user journey. A new employee can easily create an account by providing their name, email, and location. This securely creates a user in Firebase Auth and a corresponding profile document in our Firestore database."

*(Action: Show the **Sign-Up Screen** and fill it out.)*

> "Once registered, they can log in to access the app."

*(Action: Show the **Login Screen** and log in.)*

**B. The Home Screen: Your Dashboard (1.5 minutes)**

> "After logging in, you land on the Home screen, which is the central hub of the app. At the top, we have the 'Update My Status' feature."

*(Action: Tap the "Update My Status" button. Show the popup/bottom sheet.)*

> "Instead of just a simple check-in, users can specify their work status—whether they're in the office, working from home, or out sick. When a status is selected, our `notificationService` sends a tailored push notification to the rest of the team, keeping everyone in the loop."

*(Action: Select "Work From Home".)*

> "Next, we have the 'What's Trending' section. This is a dynamic feed that gives you a real-time glimpse into company activity. It aggregates the latest articles, kudos, and surveys into a single, sorted list. This is powered by a custom `useTrendingFeed` hook that listens to three different data sources simultaneously—two from Firestore and one from the Realtime Database."

*(Action: Scroll through the "What's Trending" feed and tap on one of the items to navigate.)*

**C. Content & Engagement Features (3 minutes)**

> "Pulse is built around content and interaction. Let's look at the **Articles** section."

*(Action: Navigate to the Articles tab.)*

> "Here, users can read company news and other posts. We can filter by category, and the list updates in real-time. Writing an article is simple."

*(Action: Tap the '+' FAB button to open the **Write Article** screen. Show the title, content, and category fields.)*

> "An author can save their work as a 'draft' or 'publish' it directly. Our Firestore security rules ensure that only published articles are visible to other users."

*(Action: Navigate back and open an article detail screen.)*

> "Inside an article, users can read, react with a 'like', and post comments. All of this data is stored and updated in real-time in Firestore."

> "Next, let's look at **Kudos**."

*(Action: Navigate to the Kudos tab and then to the "Give Kudos" screen.)*

> "This feature is all about peer recognition. A user can select a colleague from a list populated from our 'users' collection in Firestore, write a message, and send it. We've implemented business logic here: a user can only send two kudos per month. This is enforced in the `give-kudos` screen logic."

> "Finally, the **Company Chat**."

*(Action: Navigate to the Chat tab.)*

> "This is a live, company-wide chat room powered by the Firebase Realtime Database for maximum speed. Users can also create and participate in live polls here."

*(Action: Show the "Create a Poll" screen.)*

**D. The Profile Screen (30 seconds)**

> "The **Profile** screen summarizes a user's activity, showing their kudos count and the number of articles they've published. This data is aggregated from different Firestore collections to give a complete overview."

*(Action: Show the Profile screen.)*

---

### 4. Technical Highlight: The `useTrendingFeed` Hook (1 Minute)

> "One of the most technically interesting parts of the app is the 'What's Trending' feed. To build this, we created a custom React hook called `useTrendingFeed`.
>
> This hook sets up three separate real-time listeners:
> 1.  A Firestore listener for new **articles**.
> 2.  A Firestore listener for new **kudos**.
> 3.  A Realtime Database listener for new **surveys** in the chat.
>
> When any of these listeners fire, they call a state-safe update function. This function takes the previous list of items, removes any old items from that specific source to prevent duplicates, adds the new items, sorts the combined list by date, and finally keeps only the top 5.
>
> This approach ensures our feed is always up-to-date, sorted correctly, and free of duplicates, even with data coming from multiple asynchronous sources."

---

### 5. Conclusion & Q&A (1 Minute)

**In summary, Pulse successfully integrates key aspects of employee engagement into one cohesive platform.** By leveraging the power and flexibility of React Native and Firebase, we've built a tool that is not only functional but also a joy to use. It keeps our team connected, informed, and recognized.

**Thank you. Are there any questions?**