# 🧹 Browser Cache Cleaner

> *"Cache is great until it's not. Then it's a nightmare."* - Every web developer ever

[![GitHub license](https://img.shields.io/github/license/ugurakcil/cache-cleaner)](https://github.com/ugurakcil/cache-cleaner/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ugurakcil/cache-cleaner)](https://github.com/ugurakcil/cache-cleaner/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ugurakcil/cache-cleaner/pulls)

## 🌪️ What Is This Magical Thing?

This isn't just any cache cleaner. It's **THE** Cache Cleaner™ - the nuclear option for when users need fresh content and the browser says "Nah, I'll just use what I have, thanks."

**Browser Cache Cleaner** is a lightweight, pure JavaScript solution that wipes every possible cache mechanism in a browser:

- 🗄️ LocalStorage
- 🔄 SessionStorage
- 🍪 Cookies
- 📦 Application Cache
- 👷 Service Workers
- 🖼️ Image Cache
- 🎨 CSS Cache
- 🧠 JavaScript Cache
- ... and more browser secrets!

## 🚀 Features That Make This Special

- **One-Time Cleaning**: Cleans only when needed using clever version tracking
- **Smart Versioning**: Easy to trigger a new clean cycle by changing the version
- **Pure JavaScript**: No dependencies, just pure JS goodness
- **Cross-Browser**: Works on Chrome, Firefox, Safari, Edge, and even that one browser your grandma still uses
- **Pretty UI Option**: Fancy animations that make cleaning look cool (because why not?)
- **Silent Mode**: Can also clean everything without bothering the user

## 🔧 How to Use It

### The Super Simple Way:

```html
<script src="cache-cleaner.js"></script>
```

That's it! It will auto-run silently on page load.

### The "I Want to See Something Happen" Way:

```html
<div id="cache-message"></div>

<script src="cache-cleaner.js"></script>
<script>
  window.cacheCleaner.cleanWithUI('cache-message');
</script>
```

### The "I'm a Control Freak" Way:

```javascript
// Silent cleaning that returns a promise
window.cacheCleaner.cleanSilently().then(cleaned => {
  if (cleaned) {
    console.log("We've wiped the slate clean!");
  } else {
    console.log("Everything's already squeaky clean!");
  }
});

// Update the version manually to force cleaning next time
window.cacheCleaner.updateVersion('V2.2');

// Check if cleaning happened
if (window.cacheCleaner.wasCleaningPerformed()) {
  // Do something special for fresh content
}
```

## ⚙️ Configuration

At the top of the file, you'll find these easily changeable settings:

```javascript
// Configuration
const VERSION = 'V2.1'; // Change this to trigger new cache cleaning
const VERSION_KEY = 'version_check'; // Storage key for version
const DEBUG = false; // Set to true for console logging
```

## 🤔 When Should You Use This?

- After a major site update
- When your CSS changes keep not showing up
- When you've changed crucial JavaScript functionality
- When users complain that "the site is broken" but it works on your machine
- When you're tired of telling users to "press Ctrl+F5"
- When you want to look like a wizard by fixing problems users didn't even know they had

## 🛡️ Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ | Works flawlessly |
| Firefox | ✅ | Works like a charm |
| Safari  | ✅ | Even cleans those special Safari caches |
| Edge    | ✅ | Microsoft finally made a good browser |
| IE      | 🤷‍♂️ | Why are you still using IE? But yes, it handles the basics. |

## 🤓 Technical Deep-Dive

For those who want to understand the magic, here's what's happening under the hood:

1. We check `localStorage` for the current version
2. If the version doesn't match, the cleaning begins
3. We systematically wipe every storage mechanism
4. For browser caches, we use a combination of Cache API and clever reload techniques
5. For stubborn caches, we append cache-busting parameters
6. We save the new version to prevent unnecessary cleaning

## 🙏 Contributing

Contributions are welcome! Found a cache we missed? Have a more elegant way to clean something? PR away!

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing-cache-discovery`)
3. Commit your changes (`git commit -m 'Add support for quantum browser cache'`)
4. Push to the branch (`git push origin feature/amazing-cache-discovery`)
5. Open a Pull Request

## 📜 License

MIT License - go wild, just give credit where it's due.

## 🧙‍♂️ About the Author

Created with ❤️ (and a lot of cache frustration) by [Uğur AKÇIL](https://github.com/ugurakcil)

When not fighting with browser caches, Uğur can be found posting data science goodies on [Instagram as @datasins](https://instagram.com/datasins)

---

> "Life is too short to manually clear caches." - Uğur AKÇIL
