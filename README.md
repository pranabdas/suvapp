<h1 align="center">SUV App</h1>

<p align="center">
<a href=https://app.netlify.com/sites/suv/deploys><img src="https://api.netlify.com/api/v1/badges/fe80b0b3-f194-4be3-a816-12a4886f080d/deploy-status" alt="Netlify Status" /></a>
<a href="https://github.com/pranabdas/suvtools/blob/master/LICENSE"><img src="https://img.shields.io/github/license/sourcerer-io/hall-of-fame.svg?colorB=A31F34"></a>
</p>

This app can read SPEC/FOURC data format, and export two (or three) required
columns to plaintext format. Alternatively, you can copy data to clipboard, and
directly paste into Origin/ Igor/ Excel tables, or any other program.

### Quick start
Visit the app page <https://suv.netlify.app>. Just drag and drop drop (or browse
and select) your data file, the app will guide you through its steps (i.e.,
select scan number → select columns that you want to export etc.). Once you have
set all necessary options, click the **Process data** button, and you will be 
presented with output data table. You can even plot your data (`x` vs `y` 
column) for quick visualization.

A sample data file is available at <https://suv.netlify.app/data.txt>.

### Privacy
This is a client side application. All data are processed in your device
locally. Your data is never sent over to any remote server. Loaded data
persists only in browser memory, isolated from other processes. Once the
webapp (few mega bytes in size) is loaded in your browser, you do not
require internet connectivity to process data.

If you spot any bug or have suggestions to improve the app, please let me know.
Thank you.
