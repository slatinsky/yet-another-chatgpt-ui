# Yet another ChatGPT UI

See deployed version. Better documentation coming soon...

## Development
```bash
git clone https://github.com/slatinsky/yet-another-chatgpt-ui
cd yet-another-chatgpt-ui
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:3000` in your browser.


## Production
```bash
git clone git@github.com:slatinsky/yet-another-chatgpt-ui.git
cd yet-another-chatgpt-ui
docker build -t chat .
docker run -d --rm --name chat -p 127.0.0.1:8156:8156 chat
```

verify installation
```bash
curl http://127.0.0.1:8156
```

## License
GNU GENERAL PUBLIC LICENSE. See [LICENSE](LICENSE) for more details.

## Contributing
Feel free to open issues and pull requests.
### Short guide, how to contribute
- Fork the repository
- Create a new branch
- Implement your changes
- Commit and push the changes
- Create a pull request

If you find this project useful, please consider starring it here on GitHub :)