import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import {
    Col,
    Row,
} from 'reactstrap';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Sube el archivo docx a procesar', 'Llena los datos de las etiquetas encontradas', 'Descarga tu archivo ya procesado'];
}

export default function HorizontalNonLinearAlternativeLabelStepper(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed] = React.useState(new Set());
    const [skipped] = React.useState(new Set());

    useEffect(() => {
        const newStep = props.stepChange;
        if (newStep !== null) {
            if (activeStep < newStep) {
                handleNext();
            } else {
                handleBack();
            }
        }
    }, [props.stepChange]);

    const steps = getSteps();

    const totalSteps = () => {
        return getSteps().length;
    };

    const isStepOptional = (step) => {
        return step === 1;
    };

    const skippedSteps = () => {
        return skipped.size;
    };

    const completedSteps = () => {
        return completed.size;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps() - skippedSteps();
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed
                // find the first step that has been completed
                steps.findIndex((step, i) => !completed.has(i))
                : activeStep + 1;

        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    function isStepComplete(step) {
        return completed.has(step);
    }

    return (
        <Col md={6} sm={6} xs={12}>
            <div className={classes.root}>
                <Stepper alternativeLabel nonLinear activeStep={activeStep} style={{ backgroundColor: 'transparent' }}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const buttonProps = {};
                        if (isStepOptional(index)) {
                            // buttonProps.optional = <Typography variant="caption">Optional</Typography>;
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepButton
                                    // onClick={handleStep(index)}
                                    completed={isStepComplete(index)}
                                    {...buttonProps}
                                >
                                    <Row>
                                        {index === activeStep ? label : ''}
                                    </Row>
                                </StepButton>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
        </Col>
    );
}
