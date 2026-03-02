// Nyan Cat Module for Momentos
export const metadata = {
  id: "nyancat",
  name: "Nyan Cat",
  description: "Rainbow-riding pop-tart cat animation",
  size: "2x2",
  links: [{ label: "Nyan.cat", url: "https://www.nyan.cat/" }],
};

export function render(container, options) {
  const { theme } = options;
  const isDark = theme === "dark";

  container.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      padding: 6px;
      border-radius: 4px;
      background: ${isDark ? "#001a33" : "#0033cc"};
      overflow: hidden;
      position: relative;
    ">
      <img 
        src="https://c.tenor.com/2roX3uxz_68AAAAC/tenor.gif" 
        alt="Nyan Cat"
        style="
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        "
      />
    </div>
  `;
}
