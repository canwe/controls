
ITForms.CSB = (function (my) {

    var Relationships = [];
    var AllClientSideBehaviours = [];
    var AnimationDuration = 200;
    var Any_Keyword = '[any]';

    var RelationshipArrayContains = function (relationship) {
        for (var i = 0; i < Relationships.length; ++i) {
            if (Relationships[i].parent == relationship.parent && Relationships[i].child == relationship.child) {
                return true;
            }
        }
        return false;
    };

    var AddRelationship = function (params) {

        var relationship = {
            parent: params.SourceSelector,
            child: params.TargetSelector,
            functionname: params.FunctionName,
            params: params
        };

        if (!RelationshipArrayContains(relationship)) {
            Relationships.push(relationship);
        }
    };

    var GetRelationships = function (selector, functionname) {
        //array to hold the relationship items
        var DetectedRelationships = [];
        if (IsGroup(selector)) {
            //get all input items
            var ControlsInGroup = GetGroup(selector);
            //loop through the child items, comparing the ID to the relationships array
            for (var x = 0; x < ControlsInGroup.length; ++x) {
                var controlgroup = ControlsInGroup[x];
                for (var i = 0; i < Relationships.length; ++i) {
                    if (Relationships[i].parent == controlgroup.fieldname && Relationships[i].functionname === functionname) {
                        if ($.inArray(Relationships[i], DetectedRelationships) == -1) {
                            DetectedRelationships.push(Relationships[i]);
                        }
                    }
                }
            }
        } else {
            var control = GetControl(selector);
            if (control) {
                for (var i = 0; i < Relationships.length; ++i) {
                    if (Relationships[i].parent == control.fieldname && Relationships[i].functionname === functionname) {
                        if ($.inArray(Relationships[i], DetectedRelationships) == -1) {
                            DetectedRelationships.push(Relationships[i]);
                        }
                    }
                }
            }
        }
        return DetectedRelationships;
    };

    var CascadeRelationships = function (parent, functionname, HandledControls, func, testValuesBeforeRecursion) {

        var CurrentRelationships = GetRelationships(parent, functionname);

        if (!HandledControls) {
            HandledControls = [];
        }

        for (var x = 0; x < CurrentRelationships.length; ++x) {
            var Relationship = CurrentRelationships[x];
            var ControlID = Relationship.params["TargetSelector"];
            if ($.inArray(CurrentRelationships[x], HandledControls) == -1) {
                HandledControls.push(CurrentRelationships[x]);
                var SourceSelector = Relationship.params["SourceSelector"];
                var Operator = Relationship.params["Operator"];
                var ValueToMatch = Relationship.params["ValueToMatch"];
                if (testValuesBeforeRecursion && !TestControlValue(SourceSelector, Operator, ValueToMatch)) {
                    continue;
                }
                if (Relationship.params["Cascade"]) {
                    CascadeRelationships(ControlID, functionname, HandledControls, func, testValuesBeforeRecursion);
                }
            }
        }

        if (func) {
            func(parent);
        }
    };

    var GetControl = function (fieldname) {
        var form = RIM.Forms.Current;
        var control = form.Controls.Get(fieldname);
        return control;
    };

    var GetGroup = function (groupname) {
        var form = RIM.Forms.Current;
        var controlcollection = form.Controls.GetGroup(groupname);
        return controlcollection;
    };

    var IsGroup = function (selector) {

        var members = GetGroup(selector);
        return (members && members.length > 0);
    };

    /**
     * @return {boolean}
     */
    var TestControlValue = function (controlname, Operator, ValueToMatch) {

        if (ValueToMatch == Any_Keyword) {
            return true;
        }

        var control = GetControl(controlname);
        if (!control) {
            return false;
        }

        var ControlValue = control.Value();

        if (typeof ControlValue == 'string') {
            ControlValue = ControlValue.toLowerCase();
        }

        var values = ValueToMatch.split("||");

        switch (Operator) {
            case "Equals":
                return _.some(values, function (val) { return ControlValue == val; });
            case "DoesNotEqual":
                return _.every(values, function (val) { return ControlValue != val; });
                break;
            case "Contains":
                return _.some(values, function (val) { return ControlValue.indexOf(val) > -1; });
                break;
            case "ContainsAll":
                return _.every(values, function (val) { return ControlValue.indexOf(val) > -1; });
                break;
            case "DoesNotContain":
                return _.every(values, function (val) { return ControlValue.indexOf(val) > -1; });
                break;
            case "StartsWith":
                return _.some(values, function (val) { return ControlValue.match("^" + val) == val; });
                break;
            case "EndsWith":
                return _.some(values, function (val) { return ControlValue.match(val + "$") == val; });
                break;
            case "DoesNotStartWith":
                return _.every(values, function (val) { return ControlValue.match("^" + val) != val; });
                break;
            case "DoesNotEndWith":
                return _.every(values, function (val) { return ControlValue.match(val + "$") != val; });
                break;
            case "LessThan":
                return ControlValue < ValueToMatch;
                break;
            case "GreaterThan":
                return ControlValue > ValueToMatch;
                break;
            case "LessThanOrEqualTo":
                return ControlValue <= ValueToMatch;
                break;
            case "GreaterThanOrEqualTo":
                return ControlValue >= ValueToMatch;
                break;
        }
        return false;
    };

    var Show = function (selector, functionname) {
        CascadeRelationships(selector, functionname, null, _recursiveShow, true);
    };

    var _recursiveShow = function (selector) {
        var target = null;
        if (IsGroup(selector)) {
            target = GetGroup(selector);
            if (target) {
                for (var i = 0; i < target.length; ++i) {
                    target[i].Show(AnimationDuration);
                }
            }
        } else {
            target = GetControl(selector);
            if (target) {
                target.Show(AnimationDuration);
            }
        }
    };

    var Hide = function (selector, functionname) {
        CascadeRelationships(selector, functionname, null, _recursiveHide, true);
    };

    var _recursiveHide = function (selector) {
        var target = null;
        if (IsGroup(selector)) {
            target = GetGroup(selector);
            if (target) {
                for (var i = 0; i < target.length; ++i) {
                    target[i].Hide(AnimationDuration);
                }
            }
        } else {
            target = GetControl(selector);
            if (target) {
                target.Hide(AnimationDuration);
            }
        }
    };

    var Enable = function (selector, functionname) {
        CascadeRelationships(selector, functionname, null, _recursiveEnable, true);
    };

    var _recursiveEnable = function (selector) {
        var target = null;
        if (IsGroup(selector)) {
            target = GetGroup(selector);
            for (var i = 0; i < target.length; ++i) {
                target[i].Enable();
            }
        } else {
            target = GetControl(selector);
            target.Enable();
        }
    };

    var Disable = function (selector, functionname) {
        CascadeRelationships(selector, functionname, null, _recursiveDisable, true);
    };

    var _recursiveDisable = function (selector) {
        var target = null;
        if (IsGroup(selector)) {
            target = GetGroup(selector);
            for (var i = 0; i < target.length; ++i) {
                target[i].Disable();
            }
        } else {
            target = GetControl(selector);
            target.Disable();
        }
    };

    var ShowControl = function (conditionpassed, params) {
        if (conditionpassed) {
            Show(params.TargetSelector, "ShowControl");
        } else { //perform opposite operation
            Hide(params.TargetSelector, "ShowControl");
        }
    };

    var ShowGroup = function (conditionpassed, params) {
        if (conditionpassed) {
            Show(params.GroupName, "ShowGroup");
        } else { //perform opposite operation
            Hide(params.GroupName, "HideGroup");
        }
    };

    var HideControl = function (conditionpassed, params) {
        if (conditionpassed) {
            Hide(params.TargetSelector, "HideControl");
        } else { //perform opposite operation
            Show(params.TargetSelector, "HideControl");
        }
    };

    var HideGroup = function (conditionpassed, params) {
        if (conditionpassed) {
            Hide(params.GroupName, "");
        } else { //perform opposite operation
            Show(params.GroupName, "");
        }
    };

    var EnableControl = function (conditionpassed, params) {
        if (conditionpassed) {
            Enable(params.TargetSelector, "EnableControl");
        } else { //perform opposite operation
            Disable(params.TargetSelector, "EnableControl");
        }
    };

    var EnableGroup = function (conditionpassed, params) {
        if (conditionpassed) {
            Enable(params.GroupName, "EnableGroup");
        } else { //perform opposite operation
            Disable(params.GroupName, "EnableGroup");
        }
    };

    var DisableControl = function (conditionpassed, params) {
        if (conditionpassed) {
            Disable(params.TargetSelector, "DisableControl");
        } else { //perform opposite operation
            Enable(params.TargetSelector, "DisableControl");
        }
    };

    var DisableGroup = function (conditionpassed, params) {
        if (conditionpassed) {
            Disable(params.GroupName, "DisableGroup");
        } else { //perform opposite operation
            Enable(params.GroupName, "DisableGroup");
        }
    };

    var EnableFormSubmission = function (conditionpassed) {
        if (conditionpassed) {
            RIM.Forms.Current.EnableSubmit();
        } else { //perform opposite operation
            RIM.Forms.Current.DisableSubmit();
        }
    };

    var DisableFormSubmission = function (conditionpassed) {
        if (conditionpassed) {
            RIM.Forms.Current.DisableSubmit();
        } else { //perform opposite operation
            RIM.Forms.Current.EnableSubmit();
        }
    };

    var EnableForm = function (conditionpassed, params) {
        if (conditionpassed) {
            RIM.Forms.Current.Enable(params.AdditionalParams);
        } else { //perform opposite operation
            RIM.Forms.Current.Disable(params.AdditionalParams);
        }
    };

    var DisableForm = function (conditionpassed, params) {
        if (conditionpassed) {
            RIM.Forms.Current.Disable(params.AdditionalParams);
        } else { //perform opposite operation
            RIM.Forms.Current.Enable(params.AdditionalParams);
        }
    };

    var SetRequired = function (conditionpassed, params) {
        var target = GetControl(params.TargetSelector);
        if (conditionpassed) {
            target.SetRequired();
        } else { //perform opposite operation
            target.UnsetRequired();
        }
    };

    var UnsetRequired = function (conditionpassed, params) {
        var target = GetControl(params.TargetSelector);
        if (conditionpassed) {
            target.UnsetRequired();
        } else { //perform opposite operation
            target.SetRequired();
        }
    };

    var SetControlValue = function (conditionpassed, params) {

        if (!conditionpassed) {
            return;
        }

        var additionalparams = params.AdditionalParams;

        if (!additionalparams) {
            return;
        }

        var control = GetControl(params.TargetSelector);
        if (control) {
            control.SetValue(additionalparams);
        }
    };

    var ClearControlValue = function (conditionpassed, params) {

        if (!conditionpassed) {
            return;
        }

        var control = GetControl(params.TargetSelector);

        if (control) {
            control.Clear();
        }
    };

    var CallJavaScriptFunction = function (conditionpassed, params) {
        // only perform the function call if the given condition is met
        if (!conditionpassed) {
            return;
        }

        var sections = params.JavaScriptFunction.split('.');
        var index = 0;
        var controlsCollection = [];
        //resolve the first item to a control/group if possible
        if (sections[index].charAt(0) == '[' && sections[index].charAt(sections[index].length - 1) == ']') {
            var tmp1 = sections[index].slice(1, sections[index].length - 1);
            var selector = undefined;
            if (tmp1 == "source") {
                selector = params.SourceSelector;
            } else if (tmp1 == "target") {
                selector = params.TargetSelector;
            } else if (tmp1 == "form") {
                controlsCollection.push(RIM.Forms.Current);
            }
            else {
                selector = tmp1;
            }
            if (selector) {
                if (IsGroup(selector)) {
                    controlsCollection = GetGroup(selector);
                } else {
                    var control = GetControl(selector);
                    controlsCollection.push(control);
                }
            }
            //we've already resolved the first part of the path, so increase the loop index to start after it.
            index = 1;
        } else {
            controlsCollection.push(window);
            //sanity check
            index = 0;
        }

        //set up parameters array
        var paramsarray = params.JSFunctionParams.split('|');
        paramsarray.push(additionalArgs);

        //initialize parameters (allow for expression inputs)
        for (var m = 0; m < paramsarray.length; m++) {
            try {
                var tmp = paramsarray[m];
                var DoEval = false;

                if (!IsGroup(params.SourceSelector) && tmp.indexOf("[source]") != -1) {
                    tmp = tmp.replace('[source]', 'GetControl("' + params.SourceSelector + '")');
                    DoEval = true;
                }
                if (!IsGroup(params.TargetSelector) && tmp.indexOf("[target]") != -1) {
                    tmp = tmp.replace('[target]', 'GetControl("' + params.TargetSelector + '")');
                    DoEval = true;
                }

                // Check for other control references eg. // "[source].Value() === 'true' && [two].Value() === 'true'|200"
                var start = tmp.indexOf("[", 0);

                while (start !== -1) {

                    var end = tmp.indexOf("]", start + 1);

                    if (end !== -1) {
                        var val = tmp.substring(start + 1, end);
                        if (val !== "source" && val !== "target") {
                            if (!IsGroup(val)) {
                                if (tmp.charAt(start + 1) === '[' && tmp.charAt(end + 1) == ']') {
                                    tmp = tmp.replace("[" + val + "]", val);
                                    DoEval = true;
                                }
                                else {
                                    tmp = tmp.replace("[" + val + "]", 'GetControl("' + val + '")');
                                    DoEval = true;
                                }
                            }
                        }
                    }

                    start = tmp.indexOf("[", start + 1);
                }

                // if anonymous function was passed in then ensure we evaluate it
                var anonfunc = "(function";
                if (tmp.slice(0, anonfunc.length) == anonfunc) {
                    DoEval = true;
                }

                if (DoEval) {
                    paramsarray[m] = eval(tmp);
                }
            } catch (ex) {
                paramsarray[m] = "";
            }
        }

        for (var x = 0; x < controlsCollection.length; ++x) {
            var func = controlsCollection[x];
            var obj = controlsCollection[x];
            //drill down to find the function
            for (var i = index; i < sections.length; ++i) {
                if (func == undefined) {
                    break;
                }
                func = func[sections[i]];
            }
            //if the function exists, call it
            if (typeof func == 'function') {
                var additionalArgs = {
                    SourceSelector: params.SourceSelector,
                    Operator: params.Operator,
                    ValueToMatch: params.ValueToMatch,
                    TargetSelector: params.TargetSelector,
                    AdditionalParams: params.AdditionalParams
                };
                func.apply(obj, paramsarray);
            }
        }
    };

    var JavaScript = function (conditionpassed, params) {

        if (!conditionpassed) {
            return '';
        }

        var func = _.unescape(params.JavaScriptFunction);
        func = func.split('&#39;').join('\''); // manually unescape single quotes

        func = Interpolate(func);

        return eval(func);
    };

    var Interpolate = function (func) {

        var tmp = func;
        var start = tmp.indexOf("[", 0);

        while (start !== -1) {

            var end = tmp.indexOf("]", start + 1);

            if (end !== -1) {
                var val = tmp.substring(start + 1, end);
                if (val !== "source" && val !== "target") {
                    if (!IsGroup(val)) {
                        if (tmp.charAt(start + 1) === '[' && tmp.charAt(end + 1) == ']') {
                            tmp = tmp.replace("[" + val + "]", val);
                            DoEval = true;
                        }
                        else {
                            tmp = tmp.replace("[" + val + "]", 'GetControl("' + val + '")');
                            DoEval = true;
                        }
                    }
                }
            }

            start = tmp.indexOf("[", start + 1);
        }

        return tmp;
    };

    var ExecuteClientSideBehaviour = function (args) {

        var conditionpassed = TestControlValue(args.SourceSelector, args.Operator, args.ValueToMatch);

        if (typeof ITForms.CSB[args.FunctionName] === 'function') {
            ITForms.CSB[args.FunctionName](conditionpassed, args.params);
            return;
        }
        if (args.params.JavaScriptFunction && args.params.JavaScriptFunction !== "") {
            CallJavaScriptFunction(conditionpassed, args.params);
        }
    };

    var ExecuteAllCSBs = function () {
        for (var i = 0; i < AllClientSideBehaviours.length; ++i) {
            var args = AllClientSideBehaviours[i];
            var controlname = args.params.SourceSelector;
            var control = GetControl(controlname);
            if (control != null) {
                if (args.params.ForceExecute) {
                    ExecuteClientSideBehaviour(args);
                }
                else if (args.params.executeOnFormRender && control.IsVisible()) {
                    ExecuteClientSideBehaviour(args);
                }
            }
        }
    };

    return {
        Register: function (ControlName, FunctionName, Operator, ValueToMatch, TargetSelector, JavaScriptFunction, PerformCascades, JSFunctionParams, ExecuteOnFormRender, ForceExecute, AdditionalParams) {

            var control = GetControl(ControlName);

            if (!control) {
                return false;
            }

            var params = {
                FunctionName: FunctionName,
                SourceSelector: ControlName,
                Operator: Operator,
                ValueToMatch: ValueToMatch,
                TargetSelector: TargetSelector,
                JavaScriptFunction: JavaScriptFunction,
                Cascade: PerformCascades,
                JSFunctionParams: JSFunctionParams,
                ForceExecute: ForceExecute,
                AdditionalParams: AdditionalParams,
                executeOnFormRender: ExecuteOnFormRender
            };

            //add the relationship to the global array
            AddRelationship(params);

            control.OnValueChanged.addHandler(ExecuteClientSideBehaviour, params);

            var args = {
                params: params
            };

            AllClientSideBehaviours.push(args);
        },
        ShowControl: ShowControl,
        HideControl: HideControl,
        EnableControl: EnableControl,
        DisableControl: DisableControl,
        SetControlValue: SetControlValue,
        ClearControlValue: ClearControlValue,
        SetRequired: SetRequired,
        UnsetRequired: UnsetRequired,
        // groups
        ShowGroup: ShowGroup,
        HideGroup: HideGroup,
        EnableGroup: EnableGroup,
        DisableGroup: DisableGroup,
        // form
        DisableForm: DisableForm,
        EnableForm: EnableForm,
        DisableFormSubmission: DisableFormSubmission,
        EnableFormSubmission: EnableFormSubmission,
        ExecuteAll: ExecuteAllCSBs,
        // javascript
        JavaScript: JavaScript
    }

})(ITForms);