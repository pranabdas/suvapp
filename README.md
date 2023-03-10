<h1 align="center">SUV App</h1>

<p align="center">
<a href=https://app.netlify.com/sites/suv/deploys><img src="https://api.netlify.com/api/v1/badges/fe80b0b3-f194-4be3-a816-12a4886f080d/deploy-status" alt="Netlify Status" /></a>
<a href="https://github.com/pranabdas/suvtools/blob/master/LICENSE"><img src="https://img.shields.io/github/license/sourcerer-io/hall-of-fame.svg?colorB=A31F34"></a>
</p>

This app can read SPEC/FOURC data format, and export two (or three) required
columns to plaintext format. Alternatively, you can copy data to clipboard, and
directly paste into Origin/ Igor/ Excel tables, or any other program. Basic
visualization of your data is also available. The app is named after the SUV
Beamline of Singapore Synchrotron Light Source.

### Quick start

Visit the app page <https://suv.netlify.app>. Just drag and drop (or browse and
select) your data file, the app will guide you through its steps (i.e., select
scan number → select columns that you want to export etc.). Once you have set
all necessary options, click the **Process data** button, and you will be
presented with output data table. You can also view plot of your data (`x` vs
`y` column). If you data contains 2-dimension map data, the app can produce 3D
surface plots along with 2D contours for quick visualization. A sample data file
is available [here](https://suv.netlify.app/data.txt).

<img src="./public/demo.gif" alt="demo">


### Privacy

This is a client side application. All data are processed in your device
locally. Your data is never sent over to any remote server. Once the webapp is
loaded in the browser memory, you do not require internet connectivity to
process data. However, note that not every module is loaded during the first
page loading; they are loaded on-demand. For example, if you use the plot
functionality, internet connectivity is necessary to dynamically load required
modules during their first call.

If you spot any bug or have suggestions to improve the app, please let me know.
Thank you.
