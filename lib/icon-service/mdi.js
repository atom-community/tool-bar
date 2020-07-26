// Convert the CSS class name of mdi icons to the JS name
function mdiIconName(str) {
  // https://github.com/Templarian/MaterialDesign-JS/blob/master/build.js#L5
  let name = str.replace(/(-\w)/g, (matches) =>  matches[1].toUpperCase());
  name = `${name[0].toUpperCase()}${name.slice(1)}`;
  return `mdi${name}`;
}

let mdi; // mdi iconSet
export async function createMDIIcon(iconName) {
  if (!mdi) {
    mdi = await import('@mdi/js')
  }
  const iconData = mdi[mdiIconName(iconName)];
  const icon = document.createElement("div");
  icon.style.verticalAlign = "bottom"
  icon.innerHTML = `
    <svg viewBox='0 0 24 24'>
      <path  fill='currentColor', d='${iconData}'/>
    <svg/>
  `
  return icon
}
