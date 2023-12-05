import { NOBEL_CATEGORIES } from "../App";
import "./SelectCategory.css"

import Checkbox from '@mui/material/Checkbox';
import { FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";

export const SelectCategory = ({ selectedCategories, setSelectedCategories }) => {
    const handleChange = (event) => {
        setSelectedCategories({
            ...selectedCategories,
            [event.target.name]: event.target.checked,
        });
    };
    return (
        <FormControl sx={{ m: 3 }} component="fieldset" margin="normal" >
            <FormLabel component="legend">Categories</FormLabel>
            <FormGroup row className="form-group">
                {NOBEL_CATEGORIES.map(category => <FormControlLabel
                    control={
                        <Checkbox checked={selectedCategories[category]} onChange={handleChange} name={category} />
                    }
                    key={category}
                    label={category}
                />
                )}
            </FormGroup>
        </FormControl>
    );
}