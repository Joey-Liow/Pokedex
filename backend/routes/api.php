<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;


Route::get('/pokemons', function (Request $request) {
    
    $validated = $request->validate([
        'page' => ['sometimes', 'required', 'integer', 'min:1'],
        'limit' => ['sometimes', 'required', 'integer', 'min:1'],
    ]);


    $page = (int) ($validated['page'] ?? 1);
    $limit = (int) ($validated['limit'] ?? 10);
    $offset = ($page - 1) * $limit;

    $response = Http::timeout(5)->get('https://pokeapi.co/api/v2/pokemon/', [
        'limit' => $limit,
        'offset' => $offset
    ]);

    $results = $response->throw()->json('results');

    if (empty($results)) {
        return response()->json([]);
    }

    $pokemons = [];

    foreach ($results as $result){
        $detailUrl = $result['url'];
        $details = Http::timeout(5)->get($detailUrl)->throw()->json();

        $name = $details['name'];
        $image = $details['sprites']['other']['official-artwork']['front_default'];
        $height = $details['height'];
        $weight = $details['weight'];

        $types = [];
        foreach ($details['types'] as $type){
            $types[] = $type['type']['name'];
        }

        $pokemon = [
            'name' => $name,
            'image' => $image,
            'types' => $types,
            'height' => $height,
            'weight' => $weight
        ];

        $pokemons[] = $pokemon;
    }
        

    return response()->json($pokemons);
});
