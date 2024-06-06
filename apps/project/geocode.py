import reverse_geocoder as rg

def get_country(coor):
    return rg.search(coor)

