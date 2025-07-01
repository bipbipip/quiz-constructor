export function render(container, component, mode = 'beforeend') {
    try {
        const data = component.toString();
        container.insertAdjacentHTML(mode, data);
    } catch (e) {
        console.error('render error: ', e);
    }
}