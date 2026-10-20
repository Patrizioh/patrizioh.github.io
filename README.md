# Our Wedding

A responsive wedding album with an original rings photograph, restrained ivory and olive styling, an inline wedding film alongside the wet-knot quote, chronological photographs, a prominent guest-upload section, and a keyboard-accessible full-screen photo viewer. Film and photographs share one continuous album section, with consistent spacing and natural photo proportions.

## Personalize

This original-quality edition includes all 116 original photo files and your untouched `IMG_5296.M4V` video. Each original was copied without resizing, re-encoding, or stripping metadata, and verified against its source using SHA-256. `ORIGINAL-MEDIA.csv` lists original filenames, file sizes and hashes; `PHOTO-SOURCES.csv` maps website paths to your original filenames.

Only gallery thumbnails are resized for fast browsing. Opening a photo loads its original-resolution file. The viewer includes **Open full-size photo** and **Download original** links. The embedded player uses a higher-quality browser-compatible H.264 conversion, and **Download original film** saves the untouched Apple video. The original video is HEVC, so the compatible playback copy ensures the film still plays in browsers that cannot decode it.

Open `content.js` to edit the initials, date, photographs, or video. The initials and date still match the original reference; update them if needed. The final venue section has been removed. Photos follow an approximate sequence: before the ceremony, ceremony, just married, then the reception, with all 22 family and group portraits collected at the end. The source files have no capture timestamps, so the sequence is based on the scenes and camera filename order. Photos read left to right in rows, and twelve appear initially; “Show more photos” reveals twelve more at a time. The full-screen viewer can browse the complete collection.

The opening background uses your original rings photograph (`assets/photo-005.jpg`). The website contains no AI-edited photographs.

## Guest photo uploads through Dropbox

Find `guestUploads` near the bottom of `content.js`. Paste your Dropbox **File Request** URL into its `url` field, for example:

```js
"guestUploads": {
  "url": "https://www.dropbox.com/request/YOUR-REQUEST-ID"
}
```

Your Dropbox File Request URL is already connected. The “Upload your photos & videos” button opens it in a new tab; guests upload on Dropbox. With an empty URL, the page displays “Guest uploads opening soon.” The website itself does not store guest uploads.

- For your own photographs, create an `assets` folder and use paths such as `assets/ceremony.jpg`. Use forward slashes and exact filename capitalization.
- For an MP4, set `video.type` to `mp4` and `video.url` to a hosted MP4 URL or `assets/wedding.mp4`. Set `isSample` to `false`.
- For YouTube, set `video.type` to `youtube` and paste a normal video URL in `video.url`. For Vimeo, use `vimeo` and a video URL. The video's sharing settings must allow embedding.
- Add or remove entries in `photos`. Use `src` for the untouched original and `thumbnail` for the smaller preview. `original` supplies the download filename. Photos keep their natural proportions in balanced rows on desktop and a single column on phones. Set `width` and `height` to the oriented image dimensions so rows can be sized correctly. Include meaningful `alt` text and a caption.
- Change colors, fonts, and spacing in `styles.css`.

All photos and the film are included locally. Google Fonts needs an internet connection; the layout falls back to Georgia and Arial. The video plays directly in the album with native playback, volume and full-screen controls; it does not autoplay or open a popup. The quote “A wet knot is harder to untie” sits beside the film on desktop and below it on phones, with the line “Here’s to a love that only holds tighter.” Edit that note in `index.html`.

## Host on GitHub Pages

Use **GitHub Desktop** for this edition. The untouched video exceeds the browser uploader's limit. Every individual file is below GitHub's 100 MiB repository-file limit, so Git LFS is not required. Git LFS is not supported by GitHub Pages.

1. Extract the downloaded ZIP using **Extract All** in Windows.
2. In GitHub Desktop, clone your existing `our-wedding` repository. If you have not created one yet, create a new local repository named `our-wedding` and publish it.
3. Choose **Repository → Show in Explorer**. Copy the **contents** of this website folder into that repository folder. `index.html`, `assets`, `.github`, and `.nojekyll` must be at the repository root. Copy the extracted files, not the ZIP or a containing folder. Do not replace or delete the repository's `.git` folder.
4. In GitHub Desktop, enter a summary, choose **Commit to main**, then **Push origin**. The first upload includes nearly 1 GB of original media and can take some time.

See [GitHub Desktop upload guidance](https://docs.github.com/en/desktop/making-changes-in-a-branch/pushing-changes-to-github-from-github-desktop).

1. Create a GitHub repository and put the **contents of this folder at the repository root**, including `.github/workflows/pages.yml` and `.nojekyll`. Keep the default branch named `main` (or update `pages.yml` to match).
2. In the repository, open **Settings → Pages**, and select **GitHub Actions** as the source.
3. Push to `main`, or open **Actions → Deploy wedding site to GitHub Pages → Run workflow**.
4. When deployment completes, the Pages environment shows your site URL.

No build step, package installation, account system, or server is needed. Relative local asset paths work with both project Pages URLs and custom domains. You can alternatively select “Deploy from a branch” with `main` and `/ (root)` in Pages settings and omit the workflow.

## Preview

Open `index.html` in a browser, or serve this folder using any static web server. Video embeds behave best from an HTTP origin. The Escape key closes the photo viewer; left and right arrow keys move between photos. The site respects the visitor's reduced motion preference.

This package is ready to upload; it has not been published to a GitHub repository.

The complete site is approximately 983 MB, below the [1 GB GitHub Pages published-site limit](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). There is limited room for additional originals within that limit; guest uploads go to Dropbox and do not increase this site's size.
