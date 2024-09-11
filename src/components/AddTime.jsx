import React, { useEffect, useState } from "react";
import {
  Grid,
  Tab,
  Tabs,
  FormControlLabel,
  Checkbox,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { useTimeStore } from "../store/counselor/TimeStore";
import { StyledButton } from "../ui/StyledButton";
import { StyledTime } from "../ui/StyledTime";

const AddTime = () => {
  const { control, handleSubmit, setValue } = useForm();
  const { times, getTimes, addTimes, deleteTime } = useTimeStore();
  const [day, setDay] = useState("Sunday");
  const [selectedTab, setSelectedTab] = useState(0);
  const [dayTimes, setDayTimes] = useState({});
  const [newTime, setNewTime] = useState({ start: "", end: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    getTimes();
  }, [getTimes, isChange]);

  useEffect(() => {
    const currentTimes = times.find((time) => time.day === day)?.times || [];
    const initialCheckedState = currentTimes.reduce((acc, _, index) => {
      acc[index.toString()] = false;
      return acc;
    }, {});
    setDayTimes(initialCheckedState);
  }, [day, times]);

  useEffect(() => {
    Object.keys(dayTimes).forEach((index) => {
      setValue(index.toString(), dayTimes[index]);
    });
  }, [dayTimes, setValue]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setDay(daysOfWeek[newValue]);
    setIsDialogOpen(false);
  };

  const handleCheckboxChange = (index) => {
    setDayTimes((prev) => {
      const newDayTimes = { ...prev, [index]: !prev[index] };
      setValue(index.toString(), newDayTimes[index]);
      return newDayTimes;
    });
  };

  const handleAddTime = async () => {
    if (newTime.start && newTime.end) {
      let updatedTimes = [...times];
      const dayIndex = updatedTimes.findIndex((time) => time.day === day);

      if (dayIndex === -1) {
        updatedTimes.push({ day, times: [newTime] });
      } else {
        updatedTimes[dayIndex].times = [
          ...updatedTimes[dayIndex].times,
          newTime,
        ];
      }

      await addTimes({
        day,
        times: updatedTimes.find((time) => time.day === day).times,
      });
      setIsChange(!isChange);
      setNewTime({ start: "", end: "" });
      setIsDialogOpen(false);
    }
  };

  const onSubmit = async (data) => {
    const dayObject = times.find((time) => time.day === day);
  
    if (dayObject && dayObject.times) {
      const checkedIndexes = Object.keys(data).filter((index) => data[index]);
  
      const timesToDelete = checkedIndexes
        .map((index) => {
          const timeSlot = dayObject.times[index];
          if (timeSlot) {
            return {
              start: timeSlot.start,
              end: timeSlot.end,
            };
          }
          return null;
        })
        .filter((timeSlot) => timeSlot !== null); // Ensure that only valid time slots are added
  
      const requestBody = {
        times: timesToDelete,
      };
  
      if (timesToDelete.length > 0) {
        await deleteTime(dayObject._id, requestBody);
        setIsChange(!isChange);
      }
    }
  };
  

  const selectedDayTimes = times.find((time) => time.day === day)?.times || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container bgcolor={"white"} padding={2} borderRadius={"12px"}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="session-tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#0072BC",
              height: 4,
              borderRadius: "4px",
            },
          }}
          sx={{
            bgcolor: "white",
            "& .MuiTabs-indicator": {
              backgroundColor: "#0072BC",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
            },
            "& .Mui-selected": {
              color: "#0072BC",
            },
            paddingBottom: "20px",
          }}
        >
          {daysOfWeek.map((day) => (
            <Tab label={day} key={day} />
          ))}
        </Tabs>
        <Grid container spacing={2} padding={2} minHeight={"60vh"}>
          {selectedDayTimes.map((timeSlot, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Controller
                name={index.toString()}
                control={control}
                defaultValue={dayTimes[index] || false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={dayTimes[index] || false}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    }
                    label={`${timeSlot.start} - ${timeSlot.end}`}
                    sx={{
                      backgroundColor: "#ecf6fc",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      color: "#0072bc",
                    }}
                  />
                )}
              />
            </Grid>
          ))}

          <Grid
            item
            md={2}
            display="flex"
            alignItems="flex-start"
            justifyContent="start"
          >
            <IconButton
              onClick={() => setIsDialogOpen(true)}
              sx={{
                color: "#0072BC",
              }}
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="flex-end"
          marginTop={2}
        >
          {selectedDayTimes.length > 0 && (
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="flex-end"
              marginTop={2}
            >
              <StyledButton variant="primary" type="submit" name="Remove" />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={isDialogOpen}
        PaperProps={{
          sx: { borderRadius: "21px", padding: 3 },
        }}
        onClose={() => setIsDialogOpen(false)}
        aria-labelledby="add-time-dialog-title"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <StyledTime
                label="Start Time"
                value={newTime.start}
                onChange={(value) =>
                  setNewTime((prev) => ({ ...prev, start: value }))
                }
                placeholder="Start Time"
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTime
                label="End Time"
                value={newTime.end}
                onChange={(value) =>
                  setNewTime((prev) => ({ ...prev, end: value }))
                }
                placeholder="End Time"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <StyledButton
            variant="secondary"
            onClick={() => setIsDialogOpen(false)}
            name="Cancel"
          />
          <StyledButton variant="primary" onClick={handleAddTime} name="Add" />
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default AddTime;
