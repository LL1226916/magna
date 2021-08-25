PropertiesProvider = function (eventBus, bpmnFactory, elementRegistry, elementTemplates, translate) {

    PropertiesActivator.call(this, eventBus);
 
    this.getTabs = function (element) {

        var generalTab = {
            id: 'general',
            label: translate('General'),
            groups: createGeneralTabGroups(
                element, bpmnFactory,
                elementRegistry, elementTemplates, translate)
        };

        // var variablesTab = {
        //     id: 'variables',
        //     label: translate('Variables'),
        //     groups: createVariablesTabGroups(element, bpmnFactory, elementRegistry, translate)
        // };

        // var formsTab = {
        //     id: 'forms',
        //     label: translate('Forms'),
        //     groups: createFormsTabGroups(element, bpmnFactory, elementRegistry, translate)
        // };

        // var listenersTab = {
        //     id: 'listeners',
        //     label: translate('Listeners'),
        //     groups: createListenersTabGroups(element, bpmnFactory, elementRegistry, translate),
        //     enabled: function (element) {
        //         return !eventDefinitionHelper.getLinkEventDefinition(element)
        //             || (!is(element, 'bpmn:IntermediateThrowEvent')
        //                 && eventDefinitionHelper.getLinkEventDefinition(element));
        //     }
        // };

        // var inputOutputTab = {
        //     id: 'input-output',
        //     label: translate('Input/Output'),
        //     groups: createInputOutputTabGroups(element, bpmnFactory, elementRegistry, translate)
        // };

        // var connectorTab = {
        //     id: 'connector',
        //     label: translate('Connector'),
        //     groups: createConnectorTabGroups(element, bpmnFactory, elementRegistry, translate),
        //     enabled: function (element) {
        //         var bo = implementationTypeHelper.getServiceTaskLikeBusinessObject(element);
        //         return bo && implementationTypeHelper.getImplementationType(bo) === 'connector';
        //     }
        // };

        // var fieldInjectionsTab = {
        //     id: 'field-injections',
        //     label: translate('Field Injections'),
        //     groups: createFieldInjectionsTabGroups(element, bpmnFactory, elementRegistry, translate)
        // };

        // var extensionsTab = {
        //     id: 'extensionElements',
        //     label: translate('Extensions'),
        //     groups: createExtensionElementsGroups(element, bpmnFactory, elementRegistry, translate)
        // };
        return [generalTab];
        // return [
        //     generalTab,
        //     variablesTab,
        //     connectorTab,
        //     formsTab,
        //     listenersTab,
        //     inputOutputTab,
        //     fieldInjectionsTab,
        //     extensionsTab
        // ];
    };

};
PropertiesProvider.prototype.isEntryVisible = function (entry, element) {
    return true;
};

PropertiesProvider.prototype.isPropertyEditable = function (entry, propertyName, element) {
    return true;
};
'use strict';

var DEFAULT_PRIORITY = 1000;


/**
 * A component that decides upon the visibility / editable
 * state of properties in the properties panel.
 *
 * Implementors must subclass this component and override
 * {@link PropertiesActivator#isEntryVisible} and
 * {@link PropertiesActivator#isPropertyEditable} to provide
 * custom behavior.
 *
 * @class
 * @constructor
 *
 * @param {EventBus} eventBus
 * @param {Number} [priority] at which priority to hook into the activation
 */
function PropertiesActivator(eventBus, priority) {
    if (!eventBus) {
        eventBus = window.eventBus;
    }
    var self = this;

    priority = priority || DEFAULT_PRIORITY;

    eventBus.on('propertiesPanel.isEntryVisible', priority, function (e) {
        return self.isEntryVisible(e.entry, e.element);
    });

    eventBus.on('propertiesPanel.isPropertyEditable', priority, function (e) {
        return self.isPropertyEditable(e.entry, e.propertyName, e.element);
    });
}

PropertiesActivator.$inject = ['eventBus'];

// module.exports = PropertiesActivator;


/**
 * Should the given entry be visible for the specified element.
 *
 * @method  PropertiesActivator#isEntryVisible
 *
 * @param {EntryDescriptor} entry
 * @param {ModdleElement} element
 *
 * @returns {Boolean}
 */
PropertiesActivator.prototype.isEntryVisible = function (entry, element) {
    return true;
};

/**
 * Should the given property be editable for the specified element
 *
 * @method  PropertiesActivator#isPropertyEditable
 *
 * @param {EntryDescriptor} entry
 * @param {String} propertyName
 * @param {ModdleElement} element
 *
 * @returns {Boolean}
 */
PropertiesActivator.prototype.isPropertyEditable = function (entry, propertyName, element) {
    return true;
};


var PROCESS_KEY_HINT = 'This maps to the process definition key.';
function createGeneralTabGroups(element, bpmnFactory, elementRegistry, elementTemplates, translate) {

    // refer to target element for external labels
    element = element.labelTarget || element;

    var generalGroup = {
        id: 'general',
        label: translate('General'),
        entries: []
    };

    var idOptions;
    var processOptions;
    var is = ModelUtil.is;
    if (is(element, 'bpmn:Process')) {
        idOptions = { description: PROCESS_KEY_HINT };
    }

    if (is(element, 'bpmn:Participant')) {
        processOptions = { processIdDescription: PROCESS_KEY_HINT };
    }

    var textField = function(options, defaultParameters) {

        // Default action for the button next to the input-field
        var defaultButtonAction = function(element, inputNode) {
         // var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
        //  input.value = '';
      
          return true;
        };
      
        // default method to determine if the button should be visible
        var defaultButtonShow = function(element, inputNode) {
       //   var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
      
        //  return input.value !== '';
        };
      
      
        var resource       = defaultParameters,
            label          = options.label || resource.id,
            dataValueLabel = options.dataValueLabel,
            buttonLabel    = ( options.buttonLabel || 'X' ),
            actionName     = ( typeof options.buttonAction != 'undefined' ) ? options.buttonAction.name : 'clear',
            actionMethod   = ( typeof options.buttonAction != 'undefined' ) ? options.buttonAction.method : defaultButtonAction,
            showName       = ( typeof options.buttonShow != 'undefined' ) ? options.buttonShow.name : 'canClear',
            showMethod     = ( typeof options.buttonShow != 'undefined' ) ? options.buttonShow.method : defaultButtonShow,
            canBeDisabled  = !!options.disabled && typeof options.disabled === 'function',
            canBeHidden    = !!options.hidden && typeof options.hidden === 'function',
            description    = options.description;
      
        resource.html =
          '<label for="camunda-' + resource.id + '" ' +
            (canBeDisabled ? 'data-disable="isDisabled" ' : '') +
            (canBeHidden ? 'data-show="isHidden" ' : '') +
            (dataValueLabel ? 'data-value="' + dataValueLabel + '"' : '') + '>'+ label +'</label>' +
          '<div class="bpp-field-wrapper" ' +
            (canBeDisabled ? 'data-disable="isDisabled"' : '') +
            (canBeHidden ? 'data-show="isHidden"' : '') +
            '>' +
            '<input id="camunda-' + resource.id + '" type="text" name="' + options.modelProperty+'" ' +
              (canBeDisabled ? 'data-disable="isDisabled"' : '') +
              (canBeHidden ? 'data-show="isHidden"' : '') +
              ' />' +
            '<button class="' + actionName + '" data-action="' + actionName + '" data-show="' + showName + '" ' +
              (canBeDisabled ? 'data-disable="isDisabled"' : '') +
              (canBeHidden ? ' data-show="isHidden"' : '') + '>' +
              '<span>' + buttonLabel + '</span>' +
            '</button>' +
          '</div>';
      
        // add description below text input entry field
        if (description) {
        //  resource.html += entryFieldDescription(description);
        }
      
        resource[actionName] = actionMethod;
        resource[showName] = showMethod;
      
        if (canBeDisabled) {
          resource.isDisabled = function() {
            return options.disabled.apply(resource, arguments);
          };
        }
      
        if (canBeHidden) {
          resource.isHidden = function() {
            return !options.hidden.apply(resource, arguments);
          };
        }
      
        resource.cssClasses = ['bpp-textfield'];
      
        return resource;
      };
    var nameField=  function(element, options, translate) {

        options = options || {};
        var id = options.id || 'name',
            label = options.label || translate('Name'),
            modelProperty = options.modelProperty || 'name';
      
        var nameEntry = textField({
          id: id,
          label: label,
          modelProperty: modelProperty
        },{
            id:"name",
            html:"",
            description:""
        });
      
        return [ nameEntry ];
      
      }
    var idProps = function (group, element, translate, options) {

        var description = options && options.description;

        // Id
        group.entries.push(textField({
            id: 'id',
            label: translate('Id'),
            description: description && translate(description),
            modelProperty: 'id',
            getProperty: function (element) {
                return getBusinessObject(element).id;
            },
            setProperty: function (element, properties) {

                element = element.labelTarget || element;

                return cmdHelper.updateProperties(element, properties);
            },
            validate: function (element, values) {
                var idValue = values.id;

                var bo = getBusinessObject(element);

                var idError = utils.isIdValid(bo, idValue);

                return idError ? { id: idError } : {};
            }
        },{
            id:"id",
            html:"",
            description:""
        }));

    };
  
    var nameProps = function (group, element, translate) {
        var is = ModelUtil.is;
        if (!is(element, 'bpmn:Collaboration')) {

            var options;
            if (is(element, 'bpmn:TextAnnotation')) {
                options = { modelProperty: 'text' };
            }

            // name
            group.entries = group.entries.concat(nameField(element, options, translate));

        }

    };


    idProps(generalGroup, element, translate, idOptions);
    nameProps(generalGroup, element, translate);
    // processProps(generalGroup, element, translate, processOptions);
    // versionTag(generalGroup, element, translate);
    // executableProps(generalGroup, element, translate);
    // elementTemplateChooserProps(generalGroup, element, elementTemplates, translate);

    // var customFieldsGroups = elementTemplateCustomProps(element, elementTemplates, bpmnFactory, translate);

    var detailsGroup = {
        id: 'details',
        label: translate('Details'),
        entries: []
    };
    // serviceTaskDelegateProps(detailsGroup, element, bpmnFactory, translate);
    // userTaskProps(detailsGroup, element, translate);
    // scriptProps(detailsGroup, element, bpmnFactory, translate);
    // linkProps(detailsGroup, element, translate);
    // callActivityProps(detailsGroup, element, bpmnFactory, translate);
    // eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);
    // conditionalProps(detailsGroup, element, bpmnFactory, translate);
    // startEventInitiator(detailsGroup, element, translate); // this must be the last element of the details group!

    // var multiInstanceGroup = {
    //   id: 'multiInstance',
    //   label: translate('Multi Instance'),
    //   entries: []
    // };
    // multiInstanceProps(multiInstanceGroup, element, bpmnFactory, translate);

    // var asyncGroup = {
    //   id : 'async',
    //   label: translate('Asynchronous Continuations'),
    //   entries : []
    // };
    // asynchronousContinuationProps(asyncGroup, element, bpmnFactory, translate);

    // var jobConfigurationGroup = {
    //   id : 'jobConfiguration',
    //   label : translate('Job Configuration'),
    //   entries : [],
    //   enabled: isJobConfigEnabled
    // };
    // jobConfiguration(jobConfigurationGroup, element, bpmnFactory, translate);

    // var externalTaskGroup = {
    //   id : 'externalTaskConfiguration',
    //   label : translate('External Task Configuration'),
    //   entries : [],
    //   enabled: isExternalTaskPriorityEnabled
    // };
    // externalTaskConfiguration(externalTaskGroup, element, bpmnFactory, translate);


    // var candidateStarterGroup = {
    //   id: 'candidateStarterConfiguration',
    //   label: translate('Candidate Starter Configuration'),
    //   entries: []
    // };
    // candidateStarter(candidateStarterGroup, element, bpmnFactory, translate);

    // var historyTimeToLiveGroup = {
    //   id: 'historyConfiguration',
    //   label: translate('History Configuration'),
    //   entries: []
    // };
    // historyTimeToLive(historyTimeToLiveGroup, element, bpmnFactory, translate);

    // var documentationGroup = {
    //   id: 'documentation',
    //   label: translate('Documentation'),
    //   entries: []
    // };
    // documentationProps(documentationGroup, element, bpmnFactory, translate);

    var groups = [];
    groups.push(generalGroup);
    // customFieldsGroups.forEach(function(group) {
    //   groups.push(group);
    // });
    // groups.push(detailsGroup);
    // groups.push(externalTaskGroup);
    // groups.push(multiInstanceGroup);
    // groups.push(asyncGroup);
    // groups.push(jobConfigurationGroup);
    // groups.push(candidateStarterGroup);
    // groups.push(historyTimeToLiveGroup);
    // groups.push(documentationGroup);

    return groups;
}
