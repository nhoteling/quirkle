## packages I want loaded for all pages of my site
suppressPackageStartupMessages({
  knitr::opts_chunk$set(echo = TRUE)
  
  library(ggplot2)
  library(lubridate)
  library(dplyr)
  library(tidyr)
  library(htmltools)
  library(readr)
  library(stringr)
  library(plotly)
  
  library(r2d3)
})


#```{r, echo=FALSE, message=FALSE, warning=FALSE, include=FALSE}
# Function to remove "T" from date string
# "T" is appended to the date string so Excel doesn't
# mess it up when the file is opened
rmT <- function(fstr) { stringr::str_replace(fstr, "T", "") }

# Read data file
df.raw <- read.csv("../data/quirklescores.csv", header=TRUE) %>%
  mutate(date = ymd(rmT(date)))

# Cumulative scores
matches <- unique(df.raw$match)
d <- lapply(seq_along(matches), function(i) {
  df <- df.raw %>% filter(match == matches[i])
  df$CLu <- cumsum(df$Lu)
  df$CCr <- cumsum(df$Cr)
  df$CCo <- cumsum(df$Co)
  df$CNa <- cumsum(df$Na)
  return(df)
})
df.scores <- do.call(rbind,d)

# Rearrange for plotting
df.quirkle <- df.scores %>% 
  select(match, round, Lu, Cr, Co, Na) %>%
  pivot_longer(cols = c("Lu", "Cr", "Co", "Na")) %>%
  mutate(name = factor(name, levels = c("Co","Lu","Cr","Na"))) %>%
  arrange(match, round, name)
#```


df.totals <- df.quirkle %>% group_by(match, name) %>% summarise(score = sum(value, na.rm=TRUE))
max_round <- max(df.quirkle$round)
max_value <- max(df.quirkle$value, na.rm=TRUE)
max_score <- max(df.totals$score)