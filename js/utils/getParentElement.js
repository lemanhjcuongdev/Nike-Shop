export default function getParentElement(childElement, parentSelector) {
    return childElement.closest(parentSelector);
}
