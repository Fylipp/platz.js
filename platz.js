var Platz = Platz || (function () {
    function onChildless(element) {
        element.classList.add('platz-childless');

        if (element.nodeName === 'TABLE') {
            var children = element.childNodes;

            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.nodeType === Node.ELEMENT_NODE) {
                    switch (child.nodeName) {
                        case 'TBODY':
                            child.classList.add('platz-hidden-childless');
                            break;
                        case 'TR':
                            break;
                    }
                }
            }
        } else {
            element.classList.add('platz-hidden-childless');
        }

        var dataPlatz = element.getAttribute('data-platz');
        if (typeof dataPlatz === 'string') {
            var placeholderId = element.__platzPlaceholderId;
            var placeholder = document.getElementById(placeholderId);

            if (placeholderId && !placeholder) {
                console.warn('platz.js could not enable the automatically generated placeholder of', element, 'with the id of ', placeholderId);
                element.__platzPlaceholderId = undefined;
            }

            if (placeholderId && placeholder) {
                placeholder.classList.remove('platz-hidden-placeholder');
            } else {
                var placeholderId = element.__platzPlaceholderId = 'platz-' + Math.random().toString().slice(2);

                var placeholder = document.createElement('span');
                placeholder.id = placeholderId;
                placeholder.innerText = dataPlatz;
                
                if (element.id) {
                    placeholder.setAttribute('data-platz-for', element.id);
                }

                element.parentNode.insertBefore(placeholder, element.nextSibling);
            }
        } else {
            var placeholder = document.getElementById(element.getAttribute('data-platz-id'));

            if (placeholder !== null) {
                placeholder.classList.remove('platz-hidden-placeholder');
            } else {
                console.warn('platz.js could not enable the placeholder of', element, 'because the provided placeholder id was invalid or not present');
            }
        }
    }

    function onParent(element) {
        element.classList.remove('platz-childless');

        if (element.nodeName === 'TABLE') {
            var children = element.childNodes;

            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.nodeType === Node.ELEMENT_NODE) {
                    switch (child.nodeName) {
                        case 'TBODY':
                            child.classList.remove('platz-hidden-childless');
                            break;
                        case 'TR':
                            break;
                    }
                }
            }
        } else {
            element.classList.remove('platz-hidden-childless');
        }

        var dataPlatz = element.getAttribute('data-platz');
        if (typeof dataPlatz === 'string') {
            var placeholderId = element.__platzPlaceholderId;
            var placeholder = document.getElementById(placeholderId);

            if (placeholderId && !placeholder) {
                console.warn('platz.js could not disable the automatically generated placeholder of', element, 'with the id of ', placeholderId);
                element.__platzPlaceholderId = undefined;
            }

            if (placeholderId && placeholder) {
                placeholder.classList.add('platz-hidden-placeholder');
                placeholder.parentElement.removeChild(placeholder);
                element.__platzPlaceholderId = undefined;
            }
        } else {
            var placeholder = document.getElementById(element.getAttribute('data-platz-id'));

            if (placeholder !== null) {
                placeholder.classList.add('platz-hidden-placeholder');
            } else {
                console.warn('platz.js could not disable the placeholder of', element, 'because the provided placeholder id was invalid');
            }
        }
    }

    function hasChildren(element) {
        var isTable = element.nodeName === 'TABLE';
        var isTableBody = element.nodeName === 'TBODY';

        var children = element.childNodes;

        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if (child.nodeType === Node.ELEMENT_NODE) {
                if (isTable) {
                    if (child.nodeName === 'TBODY') {
                        if (hasChildren(child)) {
                            return true;
                        }
                    }
                } else if (isTableBody) {
                    if (child.querySelector(':scope > td')) {
                        return true;
                    }
                } else
                    return true;
            }
        }

        return false;
    }

    function branch(element, hooks) {
        if (hasChildren(element)) {
            onParent(element);

            if (hooks && hooks.onParent) {
                hooks.onParent(element);
            }
        } else {
            onChildless(element);

            if (hooks && hooks.onChildless) {
                hooks.onChildless(element);
            }
        }
    }

    var self = {
        init: function () {
            document.querySelectorAll('[data-platz]:not([data-platz-no-implicit]), [data-platz-id]:not([data-platz-no-implicit])').forEach(self.register);
        },

        register: function (element, hooks) {
            var isTable = element.nodeName === 'TABLE';

            var observerConfig = { childList: true };
            var tableBodyObserver = new MutationObserver(update);

            function update(mutations) {
                branch(element, hooks);

                function processNew(child) {
                    if (child.nodeName === 'TBODY') {
                        tableBodyObserver.observe(child, observerConfig);
                    }
                }

                if (isTable) {
                    if (mutations) {
                        mutations.forEach(function (mutation) {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach(processNew);
                            }
                        });
                    } else {
                        if (element.children) {
                            for (var i = 0; i < element.children.length; i++) {
                                processNew(element.children[i]);
                            }
                        }
                    }
                }
            }

            new MutationObserver(update).observe(element, observerConfig);

            update();
        }
    };

    return self;
})();