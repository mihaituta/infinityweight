<h1 align="center">
  <img src="https://user-images.githubusercontent.com/41682806/136675195-7eae6e82-9163-4c0a-bf14-9e3411812de9.png"/><br/>
</h1>

# Infinity Weight
**Infinity Weight** is an application I made for tracking my weight during my weight loss journey.

<a href="https://infinityweight.netlify.app" rel="noreferrer" target="_blank">Live demo</a>

Demo account: demo@gmail.com, password: 123123.
<br>

# Technologies
- **HTML**
- **CSS**
- **Sass**
- **JavaScript**
- **Vue.js**
- **Quasar**
- **Firebase**
- Hosted on **Netlify**

I chose **Quasar** because I wanted to use web technologies to create the app and use it on **mobile** and **desktop** as apps, and **Quasar** allows deployment on every major platform such as **web, android, ios, mac** and **desktop(electron)** from the same source code.

# Functionalities
Users have to create an account to have their data saved in the database.

The website has 3 main pages:
- **Home**, has 2 sections:
  - **History** displays all weights as a list where users can **add, delete, update** and **search** weights by date.
  - **Status** displays stats like **current weight** and the **weight lost** in **one week, one month, one year, this year** or **since the begining.**
- **Calendar**, here the user can also **add, update** and **delete** weights directly on the calendar, the weight and that day's change are also displayed under each respective date.
- **Chart**, here the user can see on a chart how they progressed in **one week, one month, 6 months, one year, this year** or **since the beginning.**

When a weight is **added, updated** or **deleted**, the weight update difference between the other dates is also recalculated each time.

# Installation

**Install dependencies:**
```
npm install
```
**Start local server:**
```
quasar dev
```

**Start dev electron:**
```
quasar dev -m electron
```

**Start dev android cordova (requires an emulator):**

```
quasar dev -m cordova -T android
```

## Contact
tutamihai@gmail.com
