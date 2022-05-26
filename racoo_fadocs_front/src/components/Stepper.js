import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useSelector, useDispatch } from 'react-redux'
import { moveBackwardAction, setStepAction } from '../redux/Step/step.actions'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
    return ['Sube el archivo docx a procesar', 'Llena los datos de las etiquetas encontradas', 'Descarga tu archivo ya procesado'];
}

export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const steps = getSteps();

  const dispatch = useDispatch()
  const activeStep = useSelector(state => state.step ? state.step.step : 0)

  const handleBack = () => {
    dispatch(moveBackwardAction(activeStep - 1));
  };

  const handleReset = () => {
    dispatch(setStepAction(0));
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button 
                onClick={handleReset} 
                className={classes.button}
            >
              Reset
            </Button>
          </div>
        ) : (activeStep !== 0 ?
            <Button 
                variant="contained"
                color="primary"
                onClick={handleBack} 
                className={classes.button}
                startIcon={<ChevronLeftIcon />}
            >
                Regresar al paso anterior
            </Button>
            : null
        )}
      </div>
    </div>
  );
}