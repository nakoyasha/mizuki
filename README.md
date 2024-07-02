>[!WARNING] 
>Mizuki is still pretty early in development, and may break at any point. Use at your own risk!

>[!WARNING] 
>It is **NOT** recommended to use the official instance, this project is **NOT** actively maintained anymore and thus it may be broken/offline. Proceed with caution!


<div align="center">
<img src="https://raw.githubusercontent.com/nakoyasha/mizuki/main/assets/mizuki.png" width="64"><h1 align="center">Mizuki - a multi-purpose Discord bot</h1>
<p><i> <a href="https://mangadex.org/chapter/7e355c81-c577-40e5-bade-073fbc5e01c0/17">source</a></i><p>
<p><a href="https://discord.com/oauth2/authorize?client_id=1108127187820871790">Add this bot to your server!</p>
</div>

A Discord bot that includes features useful for server owners, players of a specific gacha game, and for people who want to make silly gifs.

# Notes for contributors

- Mizuki does not come with any Discord builds saved, but test/example builds are provided. They are stored in the `testbuilds.json` file, and can be imported by either using MongoDB Compass, or the `mongoimport` command.

```bash
mongoimport testbuilds.json --jsonArray --collection=DiscordBuilds --db=mizuki
```

# Requirements
- Node.js v21 or above/below (tested on v21.4.0)
- Python 3.12.1 or above/below (tested on 3.12.1) (only for StarRailStation commands)
- MongoDB

